import { useChatContext } from "@/lib/context";
import { useScrollToBottom } from "@/lib/hooks";
import { TChatMessage } from "@/lib/types";
import { useMemo } from "react";
import { Message } from "./message";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";

export const PreviousMessages = () => {
  const { store } = useChatContext();
  // const messages = store((state) => state.messages) || [];
  const {messages} = useOpenRouterStore();
  const isStopped = store((state) => state.currentMessage?.stop);
  // const hasCurrentMessage = store((state) => !!state.currentMessage);
  const { scrollToBottom } = useScrollToBottom();

  const renderMessage = (message: any, index: number) => {
    console.log("message", message);
    // const isLast = !hasCurrentMessage && messages.length - 1 === index;
    // return <Message message={message} isLast={false} key={message.id} />;
    return <h1>{message.content}</h1>
  };

  // useEffect(() => {
  //   if (messages?.length) {
  //     scrollToBottom();
  //   }
  // }, [messages.length]);

  const previousMessages = useMemo(() => {
    console.log("messages", messages)
    return messages.map(renderMessage);
  }, [messages, isStopped]);

  return previousMessages;
};
