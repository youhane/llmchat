// import { examplePrompts } from "@/config/example-prompts";
import {
  useChatContext,
  usePreferenceContext,
  useSessions,
} from "@/lib/context";
import {
  useAssistantUtils,
  useChatEditor,
  useImageAttachment,
  useLLMRunner,
  useOpenRouter,
} from "@/lib/hooks";
import { slideUpVariant } from "@/lib/utils/animations";
import { cn } from "@/lib/utils/clsx";
import { Badge, Button, Flex, Type } from "@/ui";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChangeLogs } from "../changelogs";
import { CustomAssistantAvatar } from "../custom-assistant-avatar";
import { FullPageLoader } from "../full-page-loader";
import { ApiKeyStatus } from "./api-key-status";
import { ChatActions } from "./chat-actions";
import { ChatEditor } from "./chat-editor";
import { ChatFooter } from "./chat-footer";
import { ImageAttachment } from "./image-attachment";
import { ImageDropzoneRoot } from "./image-dropzone-root";
import { ScrollToBottomButton } from "./scroll-to-bottom-button";
import { SelectedContext } from "./selected-context";
import { StarterMessages } from "./starter-messages";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";

export const ChatInput = () => {
  const { store, isReady, refetch } = useChatContext();
  const { removeAssistantFromSessionMutation } = useSessions();
  const [openChangelog, setOpenChangelog] = useState(false);
  const { preferences, isPreferencesReady } = usePreferenceContext();
  const { getAssistantByKey, getAssistantIcon } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();
  const { invokeOpenRouter, detectIntent } = useOpenRouter();
  const { editor } = useChatEditor();
  const session = store((state) => state.session);
  const isInitialized = store((state) => state.isInitialized);
  const setIsInitialized = store((state) => state.setIsInitialized);
  const { attachment, clearAttachment, handleImageUpload, dropzonProps } =
    useImageAttachment();
  const { chats } = useOpenRouterStore();

  const isFreshSession = !isInitialized;

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (session?.id) {
      inputRef.current?.focus();
    }
  }, [session?.id]);

  const sendMessage = async (input: string) => {
    console.log("input", input)
    setIsInitialized(true);

    try {
      const intentResults = await detectIntent(input);
      console.log("intentResults", intentResults);
      await invokeOpenRouter(input, intentResults);
    } catch (error) {
      console.error("Error in intent detection flow:", error);
    }

    clearAttachment();
  };

  const chatInputBackgroundContainer = cn(
    "absolute bottom-0 right-0 left-0 flex w-full flex-col items-center justify-end gap-2 px-4 pb-1  md:px-4",
    "transition-all duration-1000 ease-in-out",
    isFreshSession && "top-0 justify-center  ",
  );

  const chatContainer = cn(
    "flex flex-col items-center flex-1 w-full gap-1 md:w-[640px] lg:w-[700px] z-10",
  );

  const renderChatBottom = () => {
    return (
      <>
        {/* {isFreshSession && (
          <StarterMessages
            messages={
              session?.customAssistant?.startMessage?.map((m) => ({
                name: m,
                content: m,
              })) || examplePrompts
            }
          />
        )} */}

        <Flex items="center" justify="center" gap="sm" className="mb-2">
          <ScrollToBottomButton />
        </Flex>

        <SelectedContext />

        <Flex
          direction="col"
          className="w-full rounded-lg border border-zinc-500/15 bg-white shadow-sm dark:bg-zinc-700"
        >
          <motion.div
            variants={slideUpVariant}
            initial="initial"
            animate={editor?.isEditable ? "animate" : "initial"}
            className="flex w-full flex-shrink-0 overflow-hidden rounded-xl"
          >
            <ImageDropzoneRoot dropzoneProps={dropzonProps}>
              <Flex direction="col" className="w-full">
                <ImageAttachment
                  attachment={attachment}
                  clearAttachment={clearAttachment}
                />
                <Flex className="flex w-full flex-row items-end gap-0 py-2 pl-2 pr-2 md:pl-3">
                  <ChatEditor sendMessage={sendMessage} editor={editor} />
                </Flex>
                <ChatActions
                  sendMessage={sendMessage}
                  handleImageUpload={handleImageUpload}
                />
              </Flex>
            </ImageDropzoneRoot>
          </motion.div>
        </Flex>
        {<ChatFooter />}
      </>
    );
  };

  return (
    <div className={chatInputBackgroundContainer}>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-zinc-25 from-40% to-transparent dark:bg-zinc-800/50 dark:from-zinc-800",
        )}
      />

      <div className={chatContainer}>
        {isFreshSession && (
          <Flex
            items="center"
            justify="center"
            direction="col"
            gap="md"
            className="mb-2 flex-1"
          >
            <ChangeLogs open={openChangelog} setOpen={setOpenChangelog} />
            <Flex direction="col" gap="xs" justify="center" items="center">
            </Flex>
          </Flex>
        )}
        {renderChatBottom()}
      </div>
    </div>
  );
};
