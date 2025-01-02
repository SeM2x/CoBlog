'use client';

import React, { useEffect, useRef } from 'react';

interface DynamicTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxRows?: number;
}

export default function DynamicTextarea({
  value,
  onChange,
  maxRows = 5,
}: DynamicTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to calculate scrollHeight
      const maxHeight =
        maxRows * parseFloat(getComputedStyle(textarea).lineHeight);
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  };
  useEffect(() => {
    adjustTextareaHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustTextareaHeight();
    onChange(e);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInput}
      placeholder='Title'
      rows={1} // Start with a single line
      className='w-full p-2 text-5xl font-semibold resize-none focus:outline-none'
      style={{
        backgroundColor: 'transparent', // Make it transparent
        border: 'none', // Remove the border
        overflowY: 'hidden', // Hide the vertical scrollbar
        whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
        wordWrap: 'break-word', // Ensure long words wrap properly
      }}
    />
  );
}
