'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';

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
  const [count, setCount] = useState(0);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  const isString = typeof text === 'string';
  const length = isString ? (text as string).length : 0;

  useEffect(() => {
    if (!isString || length === 0) {
      onFinishedRef.current?.();
      return;
    }

    setCount(0);
    let typed = 0;
    const timer = setInterval(() => {
      typed += 1;
      setCount(typed);
      if (typed >= length) {
        clearInterval(timer);
        onFinishedRef.current?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isString, length]);

  if (!isString) {
    return <Component className={className}>{text}</Component>;
  }

  // Preserve whitespace, especially newlines
  return (
    <Component className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {(text as string).slice(0, count)}
    </Component>
  );
};

export default TypingEffect;
