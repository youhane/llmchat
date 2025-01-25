import { cn } from "@/lib/utils/clsx";
import { Flex } from "@/ui";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { FC, forwardRef } from "react";

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
      className="group flex w-full items-center justify-between"
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
  function convertTextToHTML(text: string) {
    // Replace bold markers with HTML bold tags
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert numbered lists
    text = text.replace(/(\d+)\.\s*(.+)(?=\n|$)/g, '<li><strong>$2</strong></li>');
    text = `<ol>${text}</ol>`;
    
    // Convert unordered lists (if applicable)
    text = text.replace(/•\s*(.+)(?=\n|$)/g, '<li>$1</li>');
    text = `<ul>${text}</ul>`;
    
    // Convert sections to paragraphs
    text = text.replace(/(\w+):\s*(.+)(?=\n|$)/g, '<h2>$1</h2><p>$2</p>');
    
    return text;
  }
  
  
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

            <p className="text-gray-400 text-sm italic">{intent} / {model}</p>

            <div className="text-start" dangerouslySetInnerHTML={{ __html: convertTextToHTML(answer) }}/>
          </Flex>
        </CustomTrigger>
        {/* <AccordionContent className="w-full items-start p-2">
          <AIMessage message={message} isLast={isLast} />
        </AccordionContent> */}
      </AccordionItem>
    </Accordion>
  );
};
