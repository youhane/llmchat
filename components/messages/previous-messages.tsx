import { useChatContext } from "@/lib/context";
import { useScrollToBottom } from "@/lib/hooks";
import { TChatMessage } from "@/lib/types";
import { useMemo } from "react";
import { Message } from "./message";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";
import { CustomChat } from "./customChat";

export const PreviousMessages = () => {
  const { store } = useChatContext();
  const { chats: messages } = useOpenRouterStore();
  const isStopped = store((state) => state.currentMessage?.stop);

  const renderMessage = (message: any) => {
    console.log("message", message);
    // return <Message message={message} isLast={false} key={message.id} />;
    return <CustomChat
      answer={message.answer}
      question={message.question}
    />
  };

  const previousMessages = useMemo(() => {
    console.log("messages", messages)
    return messages.map(renderMessage);
  }, [messages, isStopped]);

  return previousMessages;
};
