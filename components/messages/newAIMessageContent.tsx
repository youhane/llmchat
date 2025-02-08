import { useRef } from "react";

import { CustomAssistantAvatar } from "@/components/custom-assistant-avatar";
import { ModelIcon } from "@/components/model-icon";
import { Flex } from "@/components/ui";
import { useChatContext } from "@/lib/context";
// import { AIToolMessage } from "./ai-tool-message";
import { NewAIMessageActions } from "./newAIActions";

export type TAIMessage = {
  message: string;
  modelName: string;
  intent: string;
  textContentRef: React.RefObject<HTMLDivElement>;
};

export const NewAIMessageContent = ({ message, modelName, intent, textContentRef }: TAIMessage) => {
  const { store } = useChatContext();
  // const session = store((state) => state.session);
  const messageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mt-2 flex w-full flex-row items-start justify-start gap-3">
      {/* <Flex className="flex-shrink-0">
        {session?.customAssistant?.iconURL ? (
          <CustomAssistantAvatar
            url={session?.customAssistant?.iconURL}
            alt={session?.customAssistant?.name}
            size="sm"
          />
        ) : (
          <ModelIcon type="assistants" size="sm" />
        )}
      </Flex> */}
      <Flex
        ref={messageRef}
        direction="col"
        gap="lg"
        items="start"
        className="min-w-0 flex-grow pb-8"
      >
        {/* {!!tools?.length && (
          <Flex className="w-full gap-1 pb-2" direction="col">
            {tools?.map((tool) => (
              <AIToolMessage tool={tool} key={tool.toolName} />
            ))}
          </Flex>
        )} */}

        <NewAIMessageActions
          message={message}
          modelName={modelName}
          intent={intent}
          textContentRef={textContentRef}
        />
      </Flex>
    </div>
  );
};
