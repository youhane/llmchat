import { useChatContext, usePreferenceContext } from "@/lib/context";
import {
  useAssistantUtils,
  useChatEditor,
  useImageAttachment,
  useLLMRunner,
} from "@/lib/hooks";
import { slideUpVariant } from "@/lib/utils/animations";
import { cn } from "@/lib/utils/clsx";
import { Badge, Flex, Type } from "@/ui";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GitHubButton from "react-github-btn";
import { ChangeLogs } from "../changelogs";
import { ModelIcon } from "../model-icon";
import { WelcomeMessage } from "../welcome-message";
import { ApiKeyInfo } from "./api-key-info";
import { AudioRecorder } from "./audio-recorder";
import { ChatActions } from "./chat-actions";
import { ChatEditor } from "./chat-editor";
import { ChatExamples } from "./chat-examples";
import { ImageAttachment } from "./image-attachment";
import { ImageDropzoneRoot } from "./image-dropzone-root";
import { ScrollToBottomButton } from "./scroll-to-bottom-button";
import { SelectedContext } from "./selected-context";
import { StopGenerationButton } from "./stop-generation-button";

export const ChatInput = () => {
  const { store } = useChatContext();
  const [openChangelog, setOpenChangelog] = useState(false);
  const { preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();
  const { editor } = useChatEditor();
  const session = store((state) => state.session);
  const messages = store((state) => state.messages);
  const currentMessage = store((state) => state.currentMessage);
  const context = store((state) => state.context);
  const { attachment, clearAttachment, handleImageUpload, dropzonProps } =
    useImageAttachment();

  const isFreshSession = messages.length === 0 && !currentMessage?.id;

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (session?.id) {
      inputRef.current?.focus();
    }
  }, [session?.id]);

  const sendMessage = (input: string) => {
    const props = getAssistantByKey(preferences.defaultAssistant);
    if (!props || !session) return;

    invokeModel({
      input,
      context,
      image: attachment?.base64,
      sessionId: session.id,
      assistant: props.assistant,
    });
    clearAttachment();
  };

  const chatInputBackgroundContainer = cn(
    "absolute bottom-0 right-0 left-0 flex w-full flex-col items-center justify-end gap-2 px-4 pb-3 pt-16  md:px-4",
    "transition-all duration-1000 ease-in-out",
    isFreshSession && "top-0 justify-center  ",
  );

  const chatContainer = cn(
    "flex flex-col items-center w-full gap-1 md:w-[640px] lg:w-[700px] z-10",
  );

  return (
    <div className={chatInputBackgroundContainer}>
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-white from-60% to-transparent backdrop-blur-sm dark:bg-zinc-800/50 dark:from-zinc-800",
          isFreshSession &&
            "top-0 flex h-full flex-col items-center justify-center",
        )}
        style={{
          maskImage: "linear-gradient(to top, black 60%, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black 60%, transparent)",
        }}
      />

      <div className={chatContainer}>
        {isFreshSession && (
          <Flex
            items="center"
            justify="center"
            direction="col"
            gap="md"
            className="mb-4"
          >
            <Badge
              onClick={() => setOpenChangelog(true)}
              className="cursor-pointer gap-1"
              variant="tertiary"
            >
              <Flame size={14} /> Now supports charts!!
            </Badge>

            <ChangeLogs open={openChangelog} setOpen={setOpenChangelog} />

            <ModelIcon type="llmchatlogo" size="lg" rounded={false} />
            <Type size="lg" textColor="secondary">
              How can I help you?
            </Type>
          </Flex>
        )}
        {isFreshSession && <WelcomeMessage />}

        <Flex items="center" justify="center" gap="sm" className="mb-2">
          <ScrollToBottomButton />
          <StopGenerationButton />
        </Flex>

        <SelectedContext />
        <Flex direction="col" className="w-full rounded-xl bg-zinc-500/10">
          <ApiKeyInfo />
          <motion.div
            variants={slideUpVariant}
            initial="initial"
            animate={editor?.isEditable ? "animate" : "initial"}
            className="flex w-full flex-shrink-0 overflow-hidden rounded-xl border border-zinc-500/25 bg-white shadow-sm dark:bg-zinc-700/50"
          >
            <ImageDropzoneRoot dropzoneProps={dropzonProps}>
              <Flex direction="col" className="w-full">
                <ImageAttachment
                  attachment={attachment}
                  clearAttachment={clearAttachment}
                />
                <Flex className="flex w-full flex-row items-end gap-0 py-2 pl-2 pr-2 md:pl-3">
                  <ChatEditor sendMessage={sendMessage} />
                  <AudioRecorder sendMessage={sendMessage} />
                </Flex>
              </Flex>
              <ChatActions
                sendMessage={sendMessage}
                handleImageUpload={handleImageUpload}
              />
            </ImageDropzoneRoot>
          </motion.div>
        </Flex>
        {isFreshSession && <ChatExamples />}
        {!isFreshSession && (
          <Type size="xxs" textColor="tertiary" className="pb-1">
            LLMs can make mistakes
          </Type>
        )}
      </div>
      {isFreshSession && (
        <Type
          size="xxs"
          textColor="tertiary"
          className="absolute bottom-0 z-10 py-2"
        >
          LLMChat is open source{" "}
          <span className="inline-block px-1">
            <GitHubButton
              href="https://github.com/trendy-design/llmchat"
              data-color-scheme="no-preference: light; light: light; dark: dark;"
              aria-label="Star trendy-design/llmchat on GitHub"
            >
              Star
            </GitHubButton>{" "}
          </span>
          and data is stored locally.
        </Type>
      )}
    </div>
  );
};
