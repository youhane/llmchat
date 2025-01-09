import { useChatContext } from "@/lib/context";
import { useMemo } from "react";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";
import { CustomChat } from "./customChat";

export const PreviousMessages = () => {
  const { store } = useChatContext();
  const { chats: messages } = useOpenRouterStore();
  const isStopped = store((state) => state.currentMessage?.stop);

  const renderMessage = (message: any) => {
    console.log("message", message);
    return <CustomChat
      answer={message.answer}
      question={message.question}
      model={message?.model}
      intent={message?.intent}
    />
  };

  const previousMessages = useMemo(() => {
    console.log("messages", messages)
    return messages.map(renderMessage);
  }, [messages, isStopped]);

  return previousMessages;
};
