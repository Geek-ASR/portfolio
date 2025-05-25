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

    setDisplayedText(''); // Reset if text changes
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i === text.length) {
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
