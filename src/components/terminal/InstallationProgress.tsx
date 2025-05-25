
'use client';

import type {FC} from 'react';
import React, { useState, useEffect } from 'react';

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

const InstallationProgress: FC<InstallationProgressProps> = ({ onFinished, speed = 40 }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(statusMessages[0]);
  const barLength = 25; // Number of characters for the bar itself

  useEffect(() => {
    if (currentProgress >= 100) {
      // Already handled by the interval's 100% check
      return;
    }

    const timer = setInterval(() => {
      setCurrentProgress(prev => {
        const nextVal = prev + 1;

        if (nextVal >= 100) {
          clearInterval(timer);
          setCurrentMessage(statusMessages[100]);
          setTimeout(() => {
            onFinished();
          }, 1000); // Display "Installation complete!" for 1 second
          return 100;
        }

        let newMessage = currentMessage;
        const progressKeys = Object.keys(statusMessages).map(Number).sort((a, b) => a - b);
        for (const key of progressKeys) {
          if (nextVal >= key) {
            newMessage = statusMessages[key];
          } else {
            break;
          }
        }
        setCurrentMessage(newMessage);
        return nextVal;
      });
    }, speed);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFinished, speed]); // currentProgress is managed internally by setInterval

  const filledLength = Math.round((currentProgress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const progressBar = `[${'#'.repeat(filledLength)}${' '.repeat(emptyLength)}]`;

  return (
    <div className="font-mono">
      <span>{progressBar}</span>
      <span className="ml-2 w-10 inline-block text-right">{currentProgress}%</span>
      <span className="ml-3">{currentMessage}</span>
    </div>
  );
};

export default InstallationProgress;
