'use client';

import {
  useRef,
  useState,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from 'react';
import { Input } from '@/components/ui/input';

interface CodeInputProps {
  length?: number;
  onChange: (code: string) => void;
}

export function CodeInput({ length = 6, onChange }: CodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Call onChange whenever values change
  useEffect(() => {
    onChange(values.join(''));
  }, [values, onChange]);

  const handleChange = (idx: number, value: string) => {
    // Only digits allowed, max one char
    if (/^\d?$/.test(value)) {
      const newValues = [...values];
      newValues[idx] = value;
      setValues(newValues);
      // Focus next input if digit was entered and not the last one
      if (value && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      // If current is empty, focus previous
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('Text').trim();
    if (/^\d+$/.test(pasteData)) {
      const digits = pasteData.slice(0, length).split('');
      const newValues = [...values];
      for (let i = 0; i < digits.length; i++) {
        newValues[i] = digits[i];
      }
      setValues(newValues);
      // Focus the last filled input (or last input if pasteData length < length)
      const focusIndex = Math.min(digits.length, length - 1);
      inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div className='flex justify-center space-x-2'>
      {Array.from({ length }).map((_, idx) => (
        <Input
          key={idx}
          value={values[idx]}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          maxLength={1}
          type='text'
          inputMode='numeric'
          className='w-12 h-12 text-center text-xl font-mono'
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
        />
      ))}
    </div>
  );
}
