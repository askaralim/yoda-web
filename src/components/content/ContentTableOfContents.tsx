'use client';

import { useMemo } from 'react';

interface ContentTableOfContentsProps {
  content: string;
}

const ContentTableOfContents = ({ content }: ContentTableOfContentsProps) => {
  const headings = useMemo(() => {
    if (!content) return [];
    
    // Extract h1 and h2 headings from HTML content
    const h1Regex = /<h1[^>]*>(.*?)<\/h1>/gi;
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    
    const h1Matches = Array.from(content.matchAll(h1Regex));
    const h2Matches = Array.from(content.matchAll(h2Regex));
    
    const headings = [
      ...h1Matches.map((match, index) => ({
        id: `heading-h1-${index}`,
        text: match[1].replace(/<[^>]*>/g, ''), // Remove HTML tags
        level: 1,
        element: 'h1'
      })),
      ...h2Matches.map((match, index) => ({
        id: `heading-h2-${index}`,
        text: match[1].replace(/<[^>]*>/g, ''), // Remove HTML tags
        level: 2,
        element: 'h2'
      }))
    ];
    
    return headings;
  }, [content]);

  if (headings.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        <p>暂无目录</p>
      </div>
    );
  }

  const scrollToHeading = (element: string, index: number) => {
    // This would scroll to the heading in the content
    // For now, we'll just log it
    console.log(`Scrolling to ${element} ${index}`);
  };

  return (
    <nav className="space-y-2">
      {headings.map((heading, index) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToHeading(heading.element, index);
          }}
          className={`block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
            heading.level === 1 ? 'font-medium' : 'ml-4'
          }`}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
};

export default ContentTableOfContents;
