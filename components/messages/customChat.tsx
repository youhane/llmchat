import { TChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils/clsx";
import { Flex } from "@/ui";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { FC, forwardRef } from "react";
import { AIMessage } from "./ai/ai-message";
import { ContextMessage } from "./context-message";
import { HumanMessage } from "./human-message";
import { ImageMessage } from "./image-message";

export type MessageProps = {
  question: string
  answer: string
};

const CustomTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionTrigger>
>(({ children, ...props }, ref) => (
  <AccordionHeader className="flex w-full rounded-xl p-2 hover:bg-zinc-500/10">
    <AccordionTrigger
      {...props}
      ref={ref}
      className="group flex w-full items-center justify-between"
    >
      <Flex className="w-full flex-1 items-start">{children}</Flex>
    </AccordionTrigger>
  </AccordionHeader>
));

CustomTrigger.displayName = "CustomTrigger";

export const CustomChat: FC<MessageProps> = ({ question, answer }) => {
  return (
    <Accordion
      type="single"
      className="w-full"
      collapsible
      defaultValue={answer}
    >
      <AccordionItem
        value={answer}
        key={answer}
        className={cn(
          "flex w-full flex-col items-start gap-1 py-2",
        )}
      >
        <CustomTrigger>
          <Flex direction="col" gap="md" items="start">
            {/* <ImageMessage image={message.runConfig?.image} /> */}

            {/* <ContextMessage context={message.runConfig?.context} /> */}

            {/* <HumanMessage chatMessage={answer} /> */}
            <h1 className="text-gray-400">{question}</h1>
            <h1>{answer}</h1>
          </Flex>
        </CustomTrigger>
        <AccordionContent className="w-full items-start p-2">
          {/* <AIMessage message={message} isLast={isLast} /> */}
          {/* <h1>{answer}</h1> */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
