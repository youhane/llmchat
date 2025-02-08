import { useChatContext } from "@/context";
import { useClipboard} from "@/hooks";
import {
  Button,
  Flex,
  Spinner,
  Tooltip,
  Type,
} from "@/ui";
import { Check, Copy } from "lucide-react";
import { FC } from "react";
// import { RegenerateWithModelSelect } from "../../regenerate-model-select";

export type TAIMessageActions = {
  message: string;
  modelName: string;
  intent: string;
  textContentRef: React.RefObject<HTMLDivElement>;
};

export const NewAIMessageActions: FC<TAIMessageActions> = ({
  message,
  modelName,
  intent,
  textContentRef,
}) => {
  const { store } = useChatContext();
  const isGenerating = store((state) => state.isGenerating);
  // const currentMessageId = store((state) => state.currentMessage?.id);
  // const setCurrentMessage = store((state) => state.setCurrentMessage);
  // const { removeMessageByIdMutation } = useSessions();

  const { showCopied, copy } = useClipboard();
  const handleCopyContent = () => {
    // copy(message)
    if(!textContentRef?.current) return;
    copy(textContentRef?.current?.innerText);
  };

  // const handleDeleteMessage = () => {
  //   message.parentId &&
  //     removeMessageByIdMutation.mutate(
  //       {
  //         parentId: message.parentId,
  //         messageId: message.id,
  //       },
  //       {
  //         onSettled: () => {
  //           if (currentMessageId === message.id) {
  //             setCurrentMessage(undefined);
  //           }
  //           refetch();
  //         },
  //       },
  //     );
  // };

  return (
    <Flex
      justify="between"
      items="center"
      className="w-full opacity-100 transition-opacity"
    >
      {/* {isGenerating && (
        <Flex gap="sm" items="center">
          <Spinner />
          <Type size="sm" textColor="tertiary">
            Typing ...
          </Type>
        </Flex>
      )} */}
      <Flex gap="xs" items="center" className="w-full">
        <Tooltip content="Copy">
          <Button
            variant="secondary"
            size="sm"
            rounded="lg"
            onClick={handleCopyContent}
          >
            {showCopied ? (
              <Check size={14} strokeWidth="2" />
            ) : (
              <Copy size={14} strokeWidth="2" />
            )}
            Copy
          </Button>
        </Tooltip>

        {/* <Tooltip content="Delete">
            <PopOverConfirmProvider
              title="Are you sure you want to delete this message?"
              confimBtnVariant="destructive"
              onConfirm={handleDeleteMessage}
            >
              <Button variant="secondary" size="sm" rounded="lg">
                <Trash size={14} strokeWidth="2" />
                Delete
              </Button>
            </PopOverConfirmProvider>
          </Tooltip> */}
        <Type size="sm" textColor="tertiary" className="px-2">
          {/* {message.runConfig?.assistant?.name} */}
          {intent}{" / "}{modelName}
        </Type>
      </Flex>
    </Flex>
  );
};
