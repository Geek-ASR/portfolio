
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fileSystem, findNode, getRootFileContent, type Directory, type File, type FileSystemNode } from '@/lib/file-system';
import TypingEffect from './TypingEffect';
import InstallationProgress from './InstallationProgress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';


interface CommandHistoryItem {
  id: number;
  command?: string;
  output: React.ReactNode;
  path?: string;
  isInput?: boolean;
  isSpecial?: boolean; 
}

enum TerminalPhase {
  Installing,
  Welcoming,
  Idle,
}

// Helper component to parse a line and make links clickable
const InteractiveContactLine: React.FC<{ line: string }> = ({ line }) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const urlRegex = /(https?:\/\/[\w\-\.\/\?\#\&\=\%\@\:]+)/g;
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/g;

  interface Match {
    index: number;
    length: number;
    text: string;
    type: 'url' | 'email';
  }
  const matches: Match[] = [];
  let match;

  urlRegex.lastIndex = 0; 
  while ((match = urlRegex.exec(line)) !== null) {
    matches.push({ index: match.index, length: match[0].length, text: match[0], type: 'url' });
  }

  emailRegex.lastIndex = 0; 
  while ((match = emailRegex.exec(line)) !== null) {
    if (!matches.some(m => m.index <= match.index && (m.index + m.length) >= (match.index + match[0].length) && m.type === 'url')) {
       matches.push({ index: match.index, length: match[0].length, text: match[0], type: 'email' });
    }
  }

  matches.sort((a, b) => a.index - b.index);

  for (const currentMatch of matches) {
    if (currentMatch.index > lastIndex) {
      parts.push(line.substring(lastIndex, currentMatch.index));
    }
    const linkText = currentMatch.text;
    const href = currentMatch.type === 'email' ? `mailto:${linkText}` : linkText;
    parts.push(
      <a
        key={`${currentMatch.type}-${currentMatch.index}-${linkText}`} 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[hsl(var(--accent))] hover:underline"
      >
        {linkText}
      </a>
    );
    lastIndex = currentMatch.index + currentMatch.length;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  if (parts.length === 0) {
    return <>{line}</>;
  }

  return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
};


const Terminal: React.FC = () => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [isLoading, setIsLoading] = useState(true);
  const [currentCommandId, setCurrentCommandId] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<TerminalPhase>(TerminalPhase.Installing);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const username = 'user';
  const hostname = 'ASRWorkspace';

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(scrollToBottom, [history, scrollToBottom]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const addHistory = useCallback((item: Omit<CommandHistoryItem, 'id'>) => {
    setHistory(prev => [...prev, { ...item, id: Date.now() + Math.random() }]);
    setCurrentCommandId(prev => prev + 1);
  }, []);

  useEffect(() => {
    setIsLoading(true); 
    if (currentPhase === TerminalPhase.Installing) {
      addHistory({
        output: (
          <InstallationProgress
            onFinished={() => setCurrentPhase(TerminalPhase.Welcoming)}
          />
        ),
        isSpecial: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (currentPhase === TerminalPhase.Welcoming) {
      const actualWelcomeMessage = `Weelcome to ASR_Workspace\nThis is my portfolio website\nType 'help' for a list of commands.\nIf you are more comfortable with GUI, then switch to GUI by typing cmd : 'gui'`;
      addHistory({
        output: (
          <TypingEffect
            text={actualWelcomeMessage}
            speed={20}
            onFinished={() => {
              setCurrentPhase(TerminalPhase.Idle);
              setIsLoading(false); 
            }}
          />
        ),
        isSpecial: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase, addHistory]);


  const processCommand = useCallback(async (commandInput: string) => {
    const [command, ...args] = commandInput.trim().split(' ');
    let output: React.ReactNode = `Command not found: ${command}`;
    setIsLoading(true);

    addHistory({ command: commandInput, path: currentPath, isInput: true });

    const commandArgs = args.join(' ');

    switch (command.toLowerCase()) {
      case 'help':
        output = `Available commands:
  about_me        Display information about me
  education       Display my educational background
  skills          List my technical skills
  ls [dir]        List directory contents (e.g., ls projects)
  experience      Display my work experience
  achievements    Display my achievements
  contacts        Show contact information
  cd [dir]        Change directory
  cat [file]      Display file content
  open [file]     Open a file (e.g., resume.pdf)
  export          Download resume.pdf
  gui             Switch to GUI mode
  whoami          Display current user
  date            Display current date
  echo [text]     Display text
  clear           Clear the terminal screen`;
        break;
      case 'about_me':
        output = getRootFileContent('about_me.txt');
        break;
      case 'education':
        output = getRootFileContent('education.txt');
        break;
      case 'skills':
        output = getRootFileContent('skills.txt');
        break;
      case 'experience':
        output = getRootFileContent('experience.txt');
        break;
      case 'achievements':
        output = getRootFileContent('achievements.txt');
        break;
      case 'contacts':
        const contactsContent = getRootFileContent('contacts.txt');
        if (contactsContent && typeof contactsContent === 'string') {
          const lines = contactsContent.split('\n');
          output = (
            <>
              {lines.map((line, index) => (
                <div key={index}>
                  <InteractiveContactLine line={line} />
                </div>
              ))}
            </>
          );
        } else {
          output = contactsContent || `Error: Could not load contacts.txt`;
        }
        break;
      case 'ls':
        let pathToLs = currentPath;
        if (args[0]) {
            if (args[0] === 'projects' && currentPath === '~') { 
                 pathToLs = '~/projects';
            } else if (args[0].startsWith('~/')) {
                pathToLs = args[0];
            } else if (args[0].startsWith('/')) {
                pathToLs = `~${args[0]}`;
            } else if (args[0] === '..' ) {
                if (currentPath === '~') {
                    pathToLs = '~';
                } else {
                    const parts = currentPath.split('/');
                    parts.pop();
                    pathToLs = parts.join('/') || '~';
                }
            } else if (args[0] === '~') {
                 pathToLs = '~';
            } else { 
                 pathToLs = currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`;
            }
        }
        
        pathToLs = pathToLs.replace(/~[/]+/g, '~/').replace(/\/\//g, '/');
        if (pathToLs === '/') pathToLs = '~';


        const node = findNode(pathToLs);
        if (node && node.type === 'directory') {
          if (node.children.length === 0) {
            output = 'Directory is empty.';
          } else {
            output = node.children.map(child => (
              <span key={child.name} className={child.type === 'directory' ? 'text-[hsl(var(--accent))]' : ''}>
                {child.name}{child.type === 'directory' ? '/' : ''}
              </span>
            )).reduce((prev, curr) => <>{prev}<br />{curr}</>);
          }
        } else if (node && node.type === 'file') {
          output = args[0] ? args[0] : node.name;
        }
         else {
          output = `ls: cannot access '${args[0] || '.'}': No such file or directory`;
        }
        break;
      case 'cd':
        const targetDir = args[0];
        if (!targetDir) {
          output = 'Usage: cd [directory]';
          break;
        }
        let newPath;
        if (targetDir === '..') {
          if (currentPath === '~') {
            newPath = '~';
          } else {
            const parts = currentPath.split('/');
            parts.pop();
            newPath = parts.join('/') || '~';
          }
        } else if (targetDir.startsWith('~/')) {
          newPath = targetDir;
        } else if (targetDir.startsWith('/')) {
          newPath = `~${targetDir}`;
        }
        else if (targetDir === '~') {
          newPath = '~';
        } else {
          newPath = currentPath === '~' ? `~/${targetDir}` : `${currentPath}/${targetDir}`;
        }
        
        newPath = newPath.replace(/~[/]+/g, '~/').replace(/\/\//g, '/');
        if (newPath === '/') newPath = '~';


        const targetNode = findNode(newPath);
        if (targetNode && targetNode.type === 'directory') {
          setCurrentPath(newPath);
          output = '';
        } else {
          output = `cd: no such file or directory: ${targetDir}`;
        }
        break;
      case 'cat':
        const fileToCat = args[0];
        if (!fileToCat) {
          output = 'Usage: cat [filename]';
          break;
        }
        let resolvedPathForCat: string;
        if (fileToCat.startsWith('~/')) {
          resolvedPathForCat = fileToCat;
        } else if (fileToCat.startsWith('/')) {
          resolvedPathForCat = `~${fileToCat}`;
        } else {
          resolvedPathForCat = currentPath === '~' ? `~/${fileToCat}` : `${currentPath}/${fileToCat}`;
        }
        resolvedPathForCat = resolvedPathForCat.replace(/~[/]+/g, '~/').replace(/\/\//g, '/');
         if (resolvedPathForCat === '/') resolvedPathForCat = '~';


        const catNode = findNode(resolvedPathForCat);
        if (catNode && catNode.type === 'file' && catNode.content) {
          output = catNode.content;
        } else if (catNode && catNode.type === 'file' && !catNode.content) {
          output = `cat: ${fileToCat}: File is not a text file, is empty, or cannot be displayed. Try 'open ${fileToCat}' if it's a special file type.`;
        } else {
          output = `cat: ${fileToCat}: No such file or directory`;
        }
        break;
      case 'open':
        const fileToOpen = args[0];
         if (!fileToOpen) {
          output = 'Usage: open [filename]';
          break;
        }
        let resolvedPathForOpen: string;
        if (fileToOpen.startsWith('~/')) {
          resolvedPathForOpen = fileToOpen;
        } else if (fileToOpen.startsWith('/')) {
          resolvedPathForOpen = `~${fileToOpen}`;
        } else {
          resolvedPathForOpen = currentPath === '~' ? `~/${fileToOpen}` : `${currentPath}/${fileToOpen}`;
        }
        resolvedPathForOpen = resolvedPathForOpen.replace(/~[/]+/g, '~/').replace(/\/\//g, '/');
        if (resolvedPathForOpen === '/') resolvedPathForOpen = '~';

        const openNode = findNode(resolvedPathForOpen);
        if (openNode && openNode.type === 'file' && openNode.url) {
          window.open(openNode.url, '_blank');
          output = `Opening ${fileToOpen}...`;
        } else if (openNode && openNode.type === 'directory') {
           output = `open: ${fileToOpen} is a directory. Use 'cd'.`;
        } else if (openNode && openNode.type === 'file' && !openNode.url) {
            output = `open: ${fileToOpen}: This file type cannot be opened directly. Try 'cat ${fileToOpen}' if it's a text file.`;
        }
        else {
          output = `open: ${fileToOpen}: No such file or cannot be opened.`;
        }
        break;
      case 'clear':
        setHistory([]);
        output = '';
        break;
      case 'whoami':
        output = username;
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'echo':
        output = commandArgs;
        break;
      case 'export':
        output = 'Downloading resume.pdf...';
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.setAttribute('download', 'ASRWorkspace_Resume.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case 'gui':
        output = 'Switching to GUI mode...';
        router.push('/gui');
        // Set isLoading to false after a short delay to allow navigation
        // Or handle this more robustly if navigation takes time
        setTimeout(() => setIsLoading(false), 100); 
        break;
      default:
        // Handled by initial value
        break;
    }

    if (output !== '') {
      if (typeof output === 'string' && command.toLowerCase() !== 'gui') {
        addHistory({ output: <TypingEffect text={output} speed={10} onFinished={() => setIsLoading(false)} /> });
      } else {
         addHistory({ output: output });
         // For GUI command, isLoading is handled above to allow navigation
         if (command.toLowerCase() !== 'gui') {
            setIsLoading(false);
         }
      }
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, addHistory, router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading && currentPhase !== TerminalPhase.Idle) return;

    if (inputValue.trim() === '') {
      addHistory({ command: '', path: currentPath, isInput: true });
      addHistory({ output: '' });
      setCurrentCommandId(prev => prev + 1);
      setIsLoading(false);
    } else {
      processCommand(inputValue);
    }
    setInputValue('');
  };

  const handleTerminalClick = () => {
    if (!isLoading) {
       inputRef.current?.focus();
    }
  };

  return (
    <div
      className="font-geist-mono flex h-screen w-full flex-col overflow-hidden bg-[hsl(var(--background))] p-4 text-[hsl(var(--foreground))]"
      onClick={handleTerminalClick}
    >
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="pr-2">
        {history.map((item) => (
          <div key={item.id}>
            {item.isInput && (
              <div className="flex">
                <span className="text-[hsl(var(--accent))]">{username}@{hostname}:{item.path || currentPath}$</span>
                <span className="ml-2 flex-1 whitespace-pre-wrap">{item.command}</span>
              </div>
            )}
            {item.output && (
              <div className={`whitespace-pre-wrap ${item.isSpecial ? 'my-2' : ''}`}>
                {typeof item.output === 'string' && !item.isSpecial && !item.command?.startsWith('gui') ? (
                  <TypingEffect text={item.output} speed={10} onFinished={() => setIsLoading(false)} />
                ) : (
                  item.output
                )}
              </div>
            )}
          </div>
        ))}
        </div>
      </ScrollArea>
      {(!isLoading) && currentPhase === TerminalPhase.Idle ? (
         <form onSubmit={handleSubmit} className="mt-2 flex">
          <span className="text-[hsl(var(--accent))]">{username}@{hostname}:{currentPath}$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="ml-2 flex-1 border-none bg-transparent text-[hsl(var(--foreground))] outline-none"
            autoFocus
            disabled={isLoading && currentPhase !== TerminalPhase.Idle}
          />
        </form>
      ) : (
         <div className="mt-2 flex h-6">
            {currentPhase !== TerminalPhase.Installing && currentPhase !== TerminalPhase.Welcoming && (
              <>
                <span className="text-[hsl(var(--accent))]">{username}@{hostname}:{currentPath}$</span>
                <span className="ml-2">Processing...</span>
              </>
            )}
          </div>
      )}
    </div>
  );
};

export default Terminal;
