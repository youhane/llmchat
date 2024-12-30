import { useToast } from "@/ui";
import { useChatContext } from "../context";
import { useOpenRouterStore } from "../store/openrouter.ts/store";

export const useOpenRouter = () => {
    const { store, refetch } = useChatContext();
    const editor = store((state) => state.editor);
    const setIsGenerating = store((state) => state.setIsGenerating);
    const setCurrentMessage = store((state) => state.setCurrentMessage);
    // const updateCurrentMessage = store((state) => state.updateCurrentMessage);
    const addTool = store((state) => state.addTool);
    const resetState = store((state) => state.resetState);
    const setAbortController = store((state) => state.setAbortController);
    const { toast } = useToast();
    const {setMessages, updateCurrentMessage} = useOpenRouterStore();

    const invokeOpenRouter = async (input: any, context: any) => {
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
                      "content": `This is the context ${context} This is the input ${input}`,
                    }
                  ]
                })
              }).then((response) => response.json())
                .then((data) => {
                    setIsGenerating(true);
                    // editor?.commands.clearContent();
                    console.log(data);
                    // setCurrentMessage(data.choices[0].message.content);
                    // set messages, messages is an array of messages, so like append/push it
                    setMessages(data.choices.map((choice: any) => choice.message));
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