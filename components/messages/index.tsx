import { useChatContext } from "@/libs/context";
import { PreviousMessages } from "./previous-messages";
import { Flex, Spinner, Type } from "@/ui";

export const ChatMessages = () => {
  const { store } = useChatContext();
  const isGenerating = store((state) => state.isGenerating);

  return (
    <div
      className="flex h-[100dvh] w-full flex-col items-center overflow-y-auto pb-[200px]"
      id="chat-container"
    >
      <div className="flex w-full translate-x-0 flex-col items-start px-4 pt-4 md:w-[620px] lg:w-[680px]">
        <PreviousMessages />
        <div className="my-8">
          {isGenerating && (
            <Flex gap="sm" items="center">
              <Spinner />
              <Type size="sm" textColor="tertiary">
                {"Generating..."}
              </Type>
            </Flex>
          )}
        </div>
      </div>
    </div>
  );
};
