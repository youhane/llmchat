import React from 'react';

interface FormatterProps {
  content: string;
  theme?: 'light' | 'dark';
}

const FormattedContent: React.FC<FormatterProps> = ({ content, theme = 'light' }) => {
  const parseContent = (text: string) => {
    // Split content into sections based on headers or numbers
    const sections = text.split(/(?=\*\*[\w\s&-]+\*\*:?|\d+\.\s+\*\*|^here are)/m);
    
    return sections.map((section, sectionIndex) => {
      // Check if this is a header section
      const headerMatch = section.match(/^\*\*([\w\s&-]+)\*\*:?\s*$/m);
      
      if (headerMatch) {
        // Process section with header
        const [headerLine, ...contentLines] = section.split('\n');
        const title = headerMatch[1];
        const content = contentLines.join('\n');
        
        return (
          <div key={sectionIndex} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {title}
            </h2>
            {parseItems(content)}
          </div>
        );
      } else {
        // Process regular content
        return parseItems(section, sectionIndex);
      }
    });
  };

  const parseItems = (content: string, baseKey = 0) => {
    const items = content.split(/(?=\d+\.|```)/);
    
    return items.map((item, index) => {
      // Check for numbered items with possible links and descriptions
      const numberedMatch = item.match(/^(\d+)\.\s+\*\*(.*?):\*\*\s*(?:\[(.*?)\]\((.*?)\))?\s*([\s\S]*?)(?=(?:\d+\.|```|$))/);
      
      // Check for code blocks
      const codeMatch = item.match(/```(\w+)?\n([\s\S]*?)```/);
      
      // Check for bullet points
      const bulletMatch = item.match(/^[-•]\s+(.*?)(?=(?:[-•]|$))/);

      if (numberedMatch) {
        const [_, number, title, linkText, url, description] = numberedMatch;
        return (
          <div 
          key={`${baseKey}-${index}`} 
        //   className="mb-4 border-l-4 border-blue-500 pl-4">
          className="mb-4 pl-4">
            <div className="flex gap-3">
              {/* <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {number}
              </div> */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  {title}
                </h4>
                {url && (
                  <a 
                    href={url}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm block mb-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url}
                  </a>
                )}
                <p className="text-gray-600 dark:text-gray-300">
                  {description.trim()}
                </p>
              </div>
            </div>
          </div>
        );
      } else if (codeMatch) {
        const [_, language, code] = codeMatch;
        return (
          <div key={`${baseKey}-${index}`} className="my-4">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-700 text-gray-300 text-sm">
                {language || 'code'}
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-gray-200 text-sm font-mono">
                  {code.trim()}
                </code>
              </pre>
            </div>
          </div>
        );
      } else if (bulletMatch) {
        return (
          <div key={`${baseKey}-${index}`} className="flex gap-2 mb-2">
            <span className="text-gray-400">•</span>
            <p className="text-gray-600 dark:text-gray-300">{bulletMatch[1]}</p>
          </div>
        );
      } else if (item.trim()) {
        // Regular text paragraph
        return (
          <p key={`${baseKey}-${index}`} className="text-gray-700 dark:text-gray-300 mb-4">
            {item.trim()}
          </p>
        );
      }
      
      return null;
    });
  };

  return (
    <div className={`w-full max-w-4xl text-start text-white`}>
      <div className="p-6">
        <div className="prose max-w-none dark:prose-invert">
          {parseContent(content)}
        </div>
      </div>
    </div>
  );
};

export default FormattedContent;