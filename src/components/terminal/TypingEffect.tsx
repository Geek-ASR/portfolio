
'use client';

import { useState, useEffect, type ReactNode } from 'react';

interface TypingEffectProps {
  text: string | ReactNode;
  speed?: number;
  onFinished?: () => void;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 20,
  onFinished,
  className,
  as: Component = 'span',
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');

  useEffect(() => {
    if (typeof text !== 'string' || !text) {
      setDisplayedText(text as string); // Handle non-string or empty text immediately
      if (onFinished) onFinished();
      return;
    }

    // Display the first character immediately
    setDisplayedText(text.charAt(0));

    // If text is only one character, call onFinished and exit
    if (text.length <= 1) {
      if (onFinished) {
        onFinished();
      }
      return;
    }

    let i = 1; // Start interval from the second character
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) { // Changed to >= to handle the last character correctly
        clearInterval(timer);
        if (onFinished) {
          onFinished();
        }
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onFinished]);

  if (typeof text !== 'string') {
    return <Component className={className}>{text}</Component>;
  }

  // Preserve whitespace, especially newlines
  return (
    <Component className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {displayedText}
    </Component>
  );
};

export default TypingEffect;
