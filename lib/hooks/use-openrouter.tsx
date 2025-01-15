import { useToast } from "@/ui";
import { useChatContext } from "../context";
import { useOpenRouterStore } from "../store/openrouter.ts/store";
import { LLM_MAPPING } from "@/config/openrouter-models";

type IntentData = {
  intent: string;
  accuracy: number;
};

type ParsedIntent = {
  finalIntent: string;
  otherIntents: IntentData[];
};

export const useOpenRouter = () => {
  const { store } = useChatContext();
  const editor = store((state) => state.editor);
  const setIsGenerating = store((state) => state.setIsGenerating);
  const { toast } = useToast();
  const { setChats, updateCurrentMessage } = useOpenRouterStore();

  const detectIntent = async (input: any, context?: any) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemma-2-9b-it:free",
          "messages": [{
            "role": "user",
            "content": `Strictly classify the intent of the following query into ONE domain from this list:
                  (healthcare, mathematics, programming, creative writing, science, reasoning, education,
                  general knowledge, travel, entertainment, finance, technology, shopping, history,
                  geography, art, music, sports, fitness, food, childcare, language, business,
                  marketing, job, diy, dating, psychology, law, environment, astronomy, fashion,
                  gaming, mythology, religion, pets).
  
                  and two more intents that are relevant to the query.
  
                  Sort them in descending order of confidence, with the primary intent first, do not mention any reasoning or anything more, just format your response as:
                  intent: [chosen intent from list]
                  accuracy: [confidence score between 0-1]
  
                  Query: ${input}`,
          }]
        })
      });
  
      const data = await response.json();
      
      setIsGenerating(true);
      const responseContent = data.choices[0].message.content.trim().toLowerCase();
      // const otherIntents = responseContent.split(' ').slice(1);
  
      // const parseIntent = (intent: string): string => {
      //   console.log("intent.split(' ')", intent.split(' '))
      //   return intent.split(' ')[1];
      // };

      const parseIntents = (input: string): ParsedIntent => {
        // Split input into lines and filter out empty lines
        const lines = input.split('\n').filter(line => line.trim());
        
        // Initialize array to store all intents
        const intents: IntentData[] = [];
        
        // Process pairs of lines (intent and accuracy)
        for (let i = 0; i < lines.length; i += 2) {
          const intentLine = lines[i];
          const accuracyLine = lines[i + 1];
          
          if (intentLine && accuracyLine) {
            const intent = intentLine.split(':')[1].trim();
            const accuracy = parseFloat(accuracyLine.split(':')[1].trim());
            
            intents.push({ intent, accuracy });
          }
        }
        
        // Sort intents by accuracy in descending order
        intents.sort((a, b) => b.accuracy - a.accuracy);
        
        return {
          finalIntent: intents[0].intent, // Highest accuracy intent
          otherIntents: intents // All intents with their accuracies
        };
      };

      console.log("responseContent", responseContent)
      
      let {finalIntent, otherIntents} = parseIntents(responseContent);
      
      // let finalIntent = parseIntent(responseContent);
      console.log("otherIntents", otherIntents)
      console.log("finalIntent", finalIntent);
      console.log("!(finalIntent in LLM_MAPPING)", !(finalIntent in LLM_MAPPING));
      
      if (!(finalIntent in LLM_MAPPING)) {
        finalIntent = "general knowledge";
      }
  
      setIsGenerating(false);
      const result = {
        model: LLM_MAPPING[finalIntent as keyof typeof LLM_MAPPING],
        intent: finalIntent,
        otherIntents: otherIntents
        // otherIntents: otherIntents.map((intent: string) => ({
        //   model: LLM_MAPPING[parseIntent(intent) as keyof typeof LLM_MAPPING],
        //   intent: parseIntent(intent)
        // }))
      };
  
      return result;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error detecting intent",
        variant: "destructive",
      });
      throw error;
    }
  };

  const invokeOpenRouter = async (input: any, intent?: any, context?: any,) => {
    try {
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": intent.model || "openai/gpt-3.5-turbo",
          "messages": [
            {
              "role": "user",
              // "content": `${context && "This is the context " + context} This is the input ${input}`,
              "content": ` ${input}`,
            }
          ]
        })
      }).then((response) => response.json())
        .then((data) => {
          setIsGenerating(true);
          editor?.commands.clearContent();
          setChats(input, data.choices.map((choice: any) => choice.message), intent.model, intent.intent);
          updateCurrentMessage(data.choices[0].message.content);
          setIsGenerating(false);
        });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error invoking OpenRouter",
        variant: "destructive",
      });
    }
  }

  return {
    invokeOpenRouter, detectIntent
  }
}