import { useToast } from "@/ui";
import { useChatContext } from "../context";
import { useOpenRouterStore } from "../store/openrouter.ts/store";

export const useOpenRouter = () => {
    const { store } = useChatContext();
    const editor = store((state) => state.editor);
    const setIsGenerating = store((state) => state.setIsGenerating);
    const { toast } = useToast();
    const {setChats, updateCurrentMessage} = useOpenRouterStore();

    const invokeOpenRouter = async (input: any, context?: any) => {
        try {
            fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  "model": "openai/gpt-3.5-turbo",
                  "messages": [
                    {
                      "role": "user",
                      "content": `${context && "This is the context " + context} This is the input ${input}`,
                    }
                  ]
                })
              }).then((response) => response.json())
                .then((data) => {
                    setIsGenerating(true);
                    editor?.commands.clearContent();
                    setChats(input, data.choices.map((choice: any) => choice.message));
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
        invokeOpenRouter
    }
}