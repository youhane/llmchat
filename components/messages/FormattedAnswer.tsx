// import React from 'react';

// interface LibraryEntry {
//   name: string;
//   url: string;
//   description: string;
// }

// interface Section {
//   title: string;
//   entries: LibraryEntry[];
// }

// interface FormattedContentProps {
//   content: string;
// }

// const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
//   const parseContent = (text: string): Section[] => {
//     const sections: Section[] = [];
//     let currentSection: Section | null = null;
    
//     // Split the text into lines and process each line
//     const lines = text.split('\n').filter(line => line.trim());
    
//     lines.forEach(line => {
//       // Check if line is a section header (starts with **)
//       if (line.startsWith('**') && line.endsWith('**')) {
//         if (currentSection) {
//           sections.push(currentSection);
//         }
//         currentSection = {
//           title: line.replace(/\*\*/g, ''),
//           entries: []
//         };
//       }
//       // Check if line is a numbered entry
//       else if (/^\d+\.\s\*\*/.test(line)) {
//         if (!currentSection) {
//           currentSection = {
//             title: 'General',
//             entries: []
//           };
//         }
        
//         // Extract name, URL, and description
//         const nameMatch = line.match(/\*\*(.*?):\*\*/);
//         const urlMatch = line.match(/\[(.*?)\]\((.*?)\)/);
//         const descriptionMatch = line.split(/\]\(.*?\)\s+/)[1];
        
//         if (nameMatch && descriptionMatch) {
//           currentSection.entries.push({
//             name: nameMatch[1],
//             url: urlMatch ? urlMatch[2] : '',
//             description: descriptionMatch
//           });
//         }
//       }
//     });
    
//     if (currentSection) {
//       sections.push(currentSection);
//     }
    
//     return sections;
//   };

//   const sections = parseContent(content);

//   return (
//     <div className="w-full max-w-4xl text-start text-white">
//       <div className="p-6">
//         {sections.map((section, idx) => (
//           <div key={idx} className="mb-8 last:mb-0">
//             <h2 className="text-2xl font-bold mb-4">
//               {section.title}
//             </h2>
//             <div className="space-y-4">
//               {section.entries.map((entry, entryIdx) => (
//                 <div key={entryIdx} className="border-l-4 pl-4">
//                   <h3 className="text-lg font-semibold">
//                     {entry.name}
//                   </h3>
//                   {entry.url && (
//                     <a 
//                       href={entry.url}
//                       className="text-sm mb-2 block"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {entry.url}
//                     </a>
//                   )}
//                   <p className="">
//                     {entry.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FormattedContent;






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






// import React from 'react';

// interface FormatterProps {
//   content: string;
//   theme?: 'light' | 'dark';
// }

// const FormattedContent: React.FC<FormatterProps> = ({ content, theme = 'light' }) => {
//   const parseContent = (text: string) => {
//     // Remove the initial and ending dashes if they exist
//     const cleanText = text.replace(/^---\n?|\n?---$/g, '');
    
//     // Split into entries based on the ** pattern, but keep the ** markers
//     const entries = cleanText.split(/(?=\*\*)/);
    
//     return entries.map((entry, index) => {
//       // Skip empty entries
//       if (!entry.trim()) return null;
      
//       // Extract title and description using a more compatible regex
//       const titleMatch = entry.match(/^\*\*(.*?)(?:\*\*:|\*\*)/);
      
//       if (!titleMatch) {
//         // If no title match, treat as regular paragraph
//         return (
//           <p key={index} className="text-gray-600 dark:text-gray-300 mb-4">
//             {entry.trim()}
//           </p>
//         );
//       }
      
//       const title = titleMatch[1].trim();
//       // Get everything after the title markers
//       let description = entry.slice(titleMatch[0].length).trim();
      
//       // Remove any trailing ** if they exist
//       description = description.replace(/\*\*$/, '').trim();

//       return (
//         <div key={index} className="mb-6 last:mb-0">
//           <div className="border-l-4 border-blue-500 pl-4 py-1">
//             <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
//               {title}
//             </h3>
//             {description && (
//               <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                 {description}
//               </p>
//             )}
//           </div>
//         </div>
//       );
//     }).filter(Boolean);
//   };

//   return (
//     <div className={`w-full max-w-4xl text-start ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//       <div className="p-6">
//         <div className="prose max-w-none dark:prose-invert">
//           {parseContent(content)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormattedContent;




// import React from 'react';

// interface FormatterProps {
//   content: string;
//   theme?: 'light' | 'dark';
// }

// const FormattedContent: React.FC<FormatterProps> = ({ content, theme = 'light' }) => {
//   const formatText = (text: string) => {
//     let formattedText = text;

//     // Handle bold text (both ** and __ syntax)
//     formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//     formattedText = formattedText.replace(/__(.*?)__/g, '<strong>$1</strong>');

//     // Handle italic text (both * and _ syntax)
//     formattedText = formattedText.replace(/\*(?!\*)(.*?)\*/g, '<em>$1</em>');
//     formattedText = formattedText.replace(/_(?!_)(.*?)_/g, '<em>$1</em>');

//     // Handle links [text](url)
//     formattedText = formattedText.replace(
//       /\[(.*?)\]\((.*?)\)/g,
//       '<a href="$2" class="text-blue-600 hover:text-blue-800 dark:text-blue-400" target="_blank" rel="noopener noreferrer">$1</a>'
//     );

//     return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
//   };

//   const parseContent = (text: string) => {
//     // Remove the initial and ending dashes if they exist
//     const cleanText = text.replace(/^---\n?|\n?---$/g, '');
    
//     // Split into entries based on the ** pattern, but keep the ** markers
//     const entries = cleanText.split(/(?=\*\*(?![^\[]*\]))/);
    
//     return entries.map((entry, index) => {
//       // Skip empty entries
//       if (!entry.trim()) return null;
      
//       // Extract title and description using a more compatible regex
//       const titleMatch = entry.match(/^\*\*(?![^\[]*\])(.*?)(?:\*\*:|\*\*)/);
      
//       if (!titleMatch) {
//         // If no title match, treat as regular paragraph
//         return (
//           <p key={index} className="text-gray-600 dark:text-gray-300 mb-4">
//             {formatText(entry.trim())}
//           </p>
//         );
//       }
      
//       const title = titleMatch[1].trim();
//       // Get everything after the title markers
//       let description = entry.slice(titleMatch[0].length).trim();
      
//       // Remove any trailing ** if they exist
//       description = description.replace(/\*\*$/, '').trim();

//       return (
//         <div key={index} className="mb-6 last:mb-0">
//           <div className="border-l-4 border-blue-500 pl-4 py-1">
//             <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
//               {title}
//             </h3>
//             {description && (
//               <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                 {formatText(description)}
//               </p>
//             )}
//           </div>
//         </div>
//       );
//     }).filter(Boolean);
//   };

//   return (
//     <div className={`w-full max-w-4xl text-start ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//       <div className="p-6">
//         <div className="prose max-w-none dark:prose-invert">
//           {parseContent(content)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormattedContent;




// import React from 'react';

// interface FormatterProps {
//   content: string;
//   theme?: 'light' | 'dark';
// }

// const FormattedContent: React.FC<FormatterProps> = ({ content, theme = 'light' }) => {
//   const parseContent = (text: string) => {
//     // First, separate the main content from the footer note
//     const [mainContent, ...footerParts] = text.split(/^---\s*$/m);
    
//     // Process the main content
//     const processEntries = (content: string) => {
//       // Skip the initial text before the first entry
//       const [intro, ...entries] = content.split(/(?=\*\*[^*]+:)/);
      
//       return (
//         <>
//           {/* Render intro text if it exists and isn't just whitespace */}
//           {intro && intro.trim() && !intro.trim().startsWith('**') && (
//             <p className="text-gray-600 dark:text-gray-300 mb-6">{intro.trim()}</p>
//           )}
          
//           {/* Render each entry */}
//           {entries.map((entry, index) => {
//             // Extract title and description
//             const titleMatch = entry.match(/^\*\*([^*]+?):\*\*/);
//             if (!titleMatch) return null;
            
//             const title = titleMatch[1].trim();
//             const description = entry
//               .slice(titleMatch[0].length)
//               .trim()
//               .replace(/\*\*/g, '') // Remove any remaining asterisks
//               .replace(/\\n/g, '\n'); // Handle explicit newlines
            
//             return (
//               <div key={index} className="mb-6 last:mb-0">
//                 <div className="border-l-4 border-blue-500 pl-4 py-1">
//                   <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
//                     {title}
//                   </h3>
//                   {description && (
//                     <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                       {description}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </>
//       );
//     };

//     return (
//       <>
//         {processEntries(mainContent)}
        
//         {/* Render footer note if it exists */}
//         {footerParts.length > 0 && footerParts[0].trim() && (
//           <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//             <p className="text-gray-600 dark:text-gray-300 italic">
//               {footerParts[0].trim()}
//             </p>
//           </div>
//         )}
//       </>
//     );
//   };

//   return (
//     <div className={`w-full max-w-4xl text-start ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//       <div className="p-6">
//         <div className="prose max-w-none dark:prose-invert">
//           {parseContent(content)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormattedContent;