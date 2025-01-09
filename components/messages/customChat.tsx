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

export type MessageProps = {
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
      className="group flex w-full items-center justify-between"
    >
      <Flex className="w-full flex-1 items-start">{children}</Flex>
    </AccordionTrigger>
  </AccordionHeader>
));

CustomTrigger.displayName = "CustomTrigger";

export const CustomChat: FC<MessageProps> = ({ question, answer, model = "", intent = "" }) => {
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
            <h1 className="text-gray-400">{question}</h1>
            <h1>{answer}</h1>
            <p className="text-gray-400 text-sm italic">{intent} / {model}</p>
          </Flex>
        </CustomTrigger>
        <AccordionContent className="w-full items-start p-2">
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
