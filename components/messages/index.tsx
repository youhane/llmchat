import { useChatContext } from "@/libs/context";
import { PreviousMessages } from "./previous-messages";
import { Flex, Spinner, Type } from "@/ui";
import { useOpenRouterStore } from "@/libs/store/openrouter.ts/store";
import { useEffect, useState } from "react";

export const ChatMessages = () => {
  const { store } = useChatContext();
  const isGenerating = store((state) => state.isGenerating);
  const { currentSelectedModel } = useOpenRouterStore();
  const [progressText, setProgressText] = useState("");

  useEffect(() => {
    console.log("Current model changed to:", currentSelectedModel);
  }, [currentSelectedModel]);

  // useEffect(() => {
  //   if(isGenerating){
  //     if(currentSelectedModel === ""){
  //       setProgressText("Selecting model...");
  //     } else {
  //       setProgressText("Generating..." + currentSelectedModel);
  //     }
  //   }
  // }, [currentSelectedModel, isGenerating]);

  useEffect(() => {
    if (isGenerating) {
      setProgressText(
        currentSelectedModel === "" 
          ? "Selecting model..." 
          : `Generating with ${currentSelectedModel}...`
      );
    } else {
      setProgressText("");
    }
  }, [currentSelectedModel, isGenerating]);

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
                {progressText}
                {/* {currentSelectedModel === "" ? "Selecting model..." : "Generating..."} {currentSelectedModel} */}
              </Type>
            </Flex>
          )}
        </div>
      </div>
    </div>
  );
};
