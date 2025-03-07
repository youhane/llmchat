import { useMemo, useEffect } from "react";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";
import { CustomChat } from "./customChat";
import { useScrollToBottom } from "@/hooks";
import { Message } from "./message";
import { NewMessage } from "./newMessage";
import { useChatContext } from "@/libs/context";

export const PreviousMessages = () => {
  const { scrollToBottom } = useScrollToBottom();
  const { chats: messages } = useOpenRouterStore();
  const { store } = useChatContext();
  const setIsGenerating = store((state) => state.setIsGenerating);
  const isGenerating = store((state) => state.isGenerating);

  const renderMessage = (message: any) => {
    // console.log("message", message);
    // return <CustomChat
    //   answer={message.answer}
    //   question={message.question}
    //   model={message?.model}
    //   intent={message?.intent}
    // />
    return <NewMessage
      answer={message.answer}
      question={message.question}
      model={message?.model}
      intent={message?.intent}
    />;
  };

  const previousMessages = useMemo(() => {
    // console.log("messages", messages)
    return messages.map(renderMessage);
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
    setIsGenerating(false);
  }, [previousMessages, scrollToBottom]);

  return previousMessages;
};
