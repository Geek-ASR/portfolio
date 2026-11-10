'use client';

import type {FC} from 'react';
import React, { useState, useEffect, useRef } from 'react';

interface InstallationProgressProps {
  onFinished: () => void;
  speed?: number;
}

const statusMessages: { [key: number]: string } = {
  0: "kya haal bhai?",
  25: "sab theek ghar pe",
  50: "mai toh mast hu,",
  75: "bass job mil jaye",
  100: "Installation complete! System ready.",
};

const milestones = Object.keys(statusMessages).map(Number).sort((a, b) => a - b);

const messageFor = (progress: number) => {
  let message = statusMessages[0];
  for (const key of milestones) {
    if (progress >= key) message = statusMessages[key];
    else break;
  }
  return message;
};

const bar = (progress: number, length: number) => {
  const filled = Math.round((progress / 100) * length);
  return `[${'#'.repeat(filled)}${' '.repeat(length - filled)}]`;
};

const InstallationProgress: FC<InstallationProgressProps> = ({ onFinished, speed = 40 }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    let progress = 0;
    const timer = setInterval(() => {
      progress += 1;
      setCurrentProgress(progress);
      if (progress >= 100) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer);
  }, [speed]);

  useEffect(() => {
    if (currentProgress < 100) return;
    // Display "Installation complete!" for 1 second
    const timer = setTimeout(() => onFinishedRef.current(), 1000);
    return () => clearTimeout(timer);
  }, [currentProgress]);

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 font-mono">
      <span className="whitespace-pre">
        {/* A shorter bar on phones so the line never overflows the screen. */}
        <span className="sm:hidden">{bar(currentProgress, 14)}</span>
        <span className="hidden sm:inline">{bar(currentProgress, 25)}</span>
        <span className="ml-2 inline-block w-10 text-right">{currentProgress}%</span>
      </span>
      <span>{messageFor(currentProgress)}</span>
    </div>
  );
};

export default InstallationProgress;
