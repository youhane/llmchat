import { cn } from "@/lib/utils/clsx";
import { Flex } from "@/ui";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { FC, forwardRef, useRef } from "react";
import { NewAIMessageContent } from "./newAIMessageContent";
import FormattedContent from "./FormattedAnswer";
import ReactMarkdown from 'react-markdown';

export type TMessage = {
  question: string
  answer: string
  model?: string
  intent?: string
};

const CustomTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionTrigger>
>(({ children, ...props }, ref) => (
  <AccordionHeader className="flex w-full rounded-xl p-2 hover:bg-zinc-500/10">
    <AccordionTrigger
      {...props}
      ref={ref}
      // items-center
      className="group flex w-full justify-between"
    >
      <Flex className="w-full flex-1 items-start">{children}</Flex>
    </AccordionTrigger>
  </AccordionHeader>
));

CustomTrigger.displayName = "CustomTrigger";

export const NewMessage: FC<TMessage> = ({
  question,
  answer,
  model = "",
  intent = "",
}) => {
  const markdownRef = useRef<HTMLDivElement>(null);

  return (
    <Accordion
      type="single"
      className="w-full"
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
            <h1 className="text-gray-400">{question}</h1>
            <div
              style={{
                textAlign: "start",
                lineHeight: "2.0",
              }}
            >
              <div ref={markdownRef}>
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </div>
          </Flex>
        </CustomTrigger>
        <AccordionContent className="w-full items-start p-2">
          <NewAIMessageContent
            message={answer}
            modelName={model}
            intent={intent}
            textContentRef={markdownRef}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
