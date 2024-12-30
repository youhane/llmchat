import { useChatContext, useSessions } from "@/lib/context";
import {
  useRelatedQuestions,
  useScrollToBottom,
  useTitleGenerator,
} from "@/lib/hooks";
import { useEffect } from "react";
import { ChatScrollAnchor } from "../chat-scroll-anchor";
import { Message } from "./message";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";

export const RecentMessage = () => {
  const { store } = useChatContext();
  // const currentMessage = store((state) => state.currentMessage);
  const isGenerating = store((state) => state.isGenerating);
  const prevMessagesIds = store((state) =>
    state.messages.map((message) => message.id),
  );
  const setIsGenerating = store((state) => state.setIsGenerating);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const { generateTitleForSession } = useTitleGenerator();
  const { generateRelatedQuestion } = useRelatedQuestions();
  const { addMessageMutation } = useSessions();
  const { isAtBottom, scrollToBottom } = useScrollToBottom();
  const {chats, currentMessage} = useOpenRouterStore();

  useEffect(() => {
    if (currentMessage?.id && prevMessagesIds?.includes(currentMessage?.id)) {
      setCurrentMessage(undefined);
    }
  }, [currentMessage?.id, prevMessagesIds?.length]);

  useEffect(() => {
    if (
      !currentMessage ||
      !currentMessage.stop ||
      !currentMessage?.sessionId ||
      currentMessage.relatedQuestions?.length
    )
      return;

    const processMessage = async () => {
      if (!currentMessage.sessionId) return;
      try {
        const messages = await addMessageMutation.mutateAsync({
          parentId: currentMessage.sessionId,
          message: currentMessage,
        });
        setIsGenerating(false);

        if (messages?.[0]?.sessionId && messages?.length < 2) {
          await generateTitleForSession(messages[0].sessionId as string);
        }

        const questions = await generateRelatedQuestion(
          currentMessage.sessionId,
          currentMessage.id,
        );

        if (questions?.length > 0) {
          const updatedMessage = {
            ...currentMessage,
            relatedQuestions: questions,
          };
          currentMessage.sessionId &&
            (await addMessageMutation.mutateAsync({
              parentId: currentMessage.sessionId,
              message: updatedMessage,
            }));
          setCurrentMessage(updatedMessage);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    processMessage();
  }, [currentMessage]);

  useEffect(() => {
    if (currentMessage?.id) {
      scrollToBottom();
    }
    console.log("messages", chats)
    console.log("currentMessage", currentMessage);
    console.log("isGenerating", isGenerating);
  }, [
    isGenerating,
    currentMessage?.relatedQuestions?.length,
    currentMessage?.tools?.length,
    currentMessage?.stop,
  ]);

  return (
    <>
      {currentMessage ? (
        <Message message={currentMessage} isLast={true} />
      ) : null}
      <ChatScrollAnchor
        isAtBottom={isAtBottom}
        trackVisibility={!currentMessage?.stop}
        hasMessages={!!currentMessage?.id}
      />
    </>
  );
};
