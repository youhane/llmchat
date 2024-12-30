"use client";
import { ChatInput } from "@/components/chat-input";
import { ChatTopNav } from "@/components/chat-input/chat-top-nav";
import { ChatMessages } from "@/components/messages";
import { ChatProvider, PromptsProvider, useSessions } from "@/lib/context";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";
import { Flex } from "@/ui";
import { useEffect } from "react";

const ChatSessionPage = () => {
  const { activeSessionId } = useSessions();

  useEffect(() => {
    useOpenRouterStore.getState().init();
  }, []);

  return (
    <ChatProvider sessionId={activeSessionId}>
      <PromptsProvider>
        <Flex className="w-full" direction="col">
          <ChatTopNav />
          <ChatMessages />
          <ChatInput />
        </Flex>
      </PromptsProvider>
    </ChatProvider>
  );
};

export default ChatSessionPage;
