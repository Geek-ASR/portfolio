
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fileSystem, findNode, type Directory, type File, type FileSystemNode } from '@/lib/file-system';
import TypingEffect from './TypingEffect';
import InstallationProgress from './InstallationProgress';
import { enhanceResumeWithAI } from '@/app/portfolio-actions';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommandHistoryItem {
  id: number;
  command?: string;
  output: React.ReactNode;
  path?: string;
  isInput?: boolean;
  isSpecial?: boolean; // For messages like "Enhancing resume..."
}

enum TerminalInputState {
  Idle,
  AwaitingJobDescription,
}

enum TerminalPhase {
  Installing,
  BootingText,
  Welcoming,
  Idle,
}

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [isLoading, setIsLoading] = useState(true); 
  const [currentCommandId, setCurrentCommandId] = useState(0);
  const [terminalInputState, setTerminalInputState] = useState<TerminalInputState>(TerminalInputState.Idle);
  const [resumeContentForAI, setResumeContentForAI] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<TerminalPhase>(TerminalPhase.Installing);

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
    setIsLoading(true); // Disable input during startup sequence
    if (currentPhase === TerminalPhase.Installing) {
      addHistory({
        output: (
          <InstallationProgress
            onFinished={() => setCurrentPhase(TerminalPhase.BootingText)}
          />
        ),
        isSpecial: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount to kick off installation

  useEffect(() => {
    if (currentPhase === TerminalPhase.BootingText) {
      const installationMessages = 
        "Initializing ASRWorkspace v1.0.0...\n" +
        "Scanning for available modules...\n" +
        "Loading core components... [OK]\n" +
        "Establishing secure connection to ASRNet...\n" +
        "Virtual environment setup... [DONE]\n" +
        "Fetching latest package manifests...\n" +
        "Resolving dependencies... found 324 packages.\n" +
        "Installing packages: [coreutils, net-tools, ai-enhancer, ui-kit]... Done.\n" +
        "Verifying system integrity... [PASS]\n" +
        "Finalizing setup...\n" +
        "Boot sequence complete.";
      
      addHistory({
        output: (
          <TypingEffect
            text={installationMessages}
            speed={30}
            onFinished={() => setCurrentPhase(TerminalPhase.Welcoming)}
          />
        ),
        isSpecial: true,
      });
    } else if (currentPhase === TerminalPhase.Welcoming) {
      const actualWelcomeMessage = `Welcome to ASRWorkspace\nThis is my portfolio website\nType 'help' for a list of commands.\nIf you are more comfortable with GUI, then switch to GUI by typing cmd : 'gui'`;
      addHistory({
        output: (
          <TypingEffect
            text={actualWelcomeMessage}
            speed={20}
            onFinished={() => {
              setCurrentPhase(TerminalPhase.Idle);
              setIsLoading(false); // Enable input
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

    if (terminalInputState === TerminalInputState.AwaitingJobDescription) {
      const jobDescription = commandInput.trim() === '' ? undefined : commandInput.trim();
      if (resumeContentForAI) {
        addHistory({ output: "Enhancing resume with AI...", isSpecial: true });
        const aiResult = await enhanceResumeWithAI({ resumeContent: resumeContentForAI, jobDescription });
        output = (
          <>
            <p>AI Resume Enhancement Suggestions:</p>
            <ul>
              {aiResult.suggestions.map((s, i) => (
                <li key={i} className="ml-4">- {s}</li>
              ))}
            </ul>
          </>
        );
      } else {
        output = "Error: Resume content not found for AI enhancement.";
      }
      setTerminalInputState(TerminalInputState.Idle);
      setResumeContentForAI(null);
    } else {
       addHistory({ command: commandInput, path: currentPath, isInput: true });
      switch (command.toLowerCase()) {
        case 'help':
          output = `Available commands:
  help          Show this help message
  ls            List directory contents
  cd [dir]      Change directory
  cat [file]    Display file content
  open [file]   Open a file (e.g., resume.pdf)
  clear         Clear the terminal screen
  whoami        Display current user
  date          Display current date
  echo [text]   Display text
  export        Download resume.pdf
  enhance-resume Enhance your resume using AI
  gui           Switch to GUI mode (placeholder)`;
          break;
        case 'ls':
          const node = findNode(currentPath);
          if (node && node.type === 'directory') {
            output = node.children.map(child => (
              <span key={child.name} className={child.type === 'directory' ? 'text-[hsl(var(--accent))]' : ''}>
                {child.name}{child.type === 'directory' ? '/' : ''}
              </span>
            )).reduce((prev, curr) => <>{prev}<br />{curr}</>);
          } else {
            output = 'Error: Not a directory.';
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
          } else if (targetDir === '~' || targetDir === '/') {
            newPath = '~';
          } else {
            newPath = currentPath === '~' ? `~/${targetDir}` : `${currentPath}/${targetDir}`;
          }
          const targetNode = findNode(newPath);
          if (targetNode && targetNode.type === 'directory') {
            setCurrentPath(newPath);
            output = ''; // No output for successful cd
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
          const filePathCat = currentPath === '~' ? fileToCat : `${currentPath.substring(2)}/${fileToCat}`;
          const catNode = findNode(filePathCat);
          if (catNode && catNode.type === 'file' && catNode.content) {
            output = catNode.content;
          } else if (catNode && catNode.type === 'file' && !catNode.content) {
            output = `cat: ${fileToCat} is not a text file or is empty. Try 'open ${fileToCat}'.`;
          }
          else {
            output = `cat: ${fileToCat}: No such file or directory`;
          }
          break;
        case 'open':
          const fileToOpen = args[0];
           if (!fileToOpen) {
            output = 'Usage: open [filename]';
            break;
          }
          const filePathOpen = currentPath === '~' ? fileToOpen : `${currentPath.substring(2)}/${fileToOpen}`;
          const openNode = findNode(filePathOpen);
          if (openNode && openNode.type === 'file' && openNode.url) {
            window.open(openNode.url, '_blank');
            output = `Opening ${fileToOpen}...`;
          } else if (openNode && openNode.type === 'directory') {
             output = `open: ${fileToOpen} is a directory. Use 'cd'.`;
          } else {
            output = `open: ${fileToOpen}: No such file or cannot be opened.`;
          }
          break;
        case 'clear':
          setHistory([]);
          // Re-add the installation and welcome sequence if desired, or just clear.
          // For now, just clears and provides a new prompt.
          // If you want to restart the whole sequence:
          // setCurrentPhase(TerminalPhase.Installing);
          // setIsLoading(true); 
          output = ''; // Standard clear command just clears screen
          break;
        case 'whoami':
          output = username;
          break;
        case 'date':
          output = new Date().toString();
          break;
        case 'echo':
          output = args.join(' ');
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
        case 'enhance-resume':
          const resumeTxtNode = findNode('resume.txt');
          if (resumeTxtNode && resumeTxtNode.type === 'file' && resumeTxtNode.content) {
            setResumeContentForAI(resumeTxtNode.content);
            setTerminalInputState(TerminalInputState.AwaitingJobDescription);
            output = `(Optional) Paste job description below and press Enter, or just press Enter to skip:`;
          } else {
            output = "Error: resume.txt not found in the root directory.";
          }
          break;
        case 'gui': 
          output = 'Switching to GUI mode... (Feature not yet implemented)';
          break;
        default:
          // Handled by initial value
          break;
      }
    }
    
    if (output !== '') {
      // Use TypingEffect for command outputs for consistency, unless it's already a component
      if (typeof output === 'string') {
        addHistory({ output: <TypingEffect text={output} speed={10} onFinished={() => setIsLoading(false)} /> });
      } else {
         addHistory({ output: output }); // output is already a ReactNode (e.g. from ls or AI suggestions)
         setIsLoading(false); // Assume components like TypingEffect within output will handle their own loading
      }
    } else {
      setIsLoading(false); // If output is empty (e.g. 'cd', 'clear'), stop loading
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, addHistory, terminalInputState, resumeContentForAI]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading && currentPhase !== TerminalPhase.Idle) return; // Don't process commands during startup

    if (inputValue.trim() === '' && terminalInputState !== TerminalInputState.AwaitingJobDescription) {
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
    if (!isLoading || terminalInputState === TerminalInputState.AwaitingJobDescription) {
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
            {/* Ensure output is rendered, checking if it's a string or ReactNode */}
            {item.output && (
              <div className={`whitespace-pre-wrap ${item.isSpecial ? 'my-2' : ''}`}>
                {typeof item.output === 'string' ? <TypingEffect text={item.output} speed={10} onFinished={item.isSpecial ? undefined : () => setIsLoading(false)} /> : item.output}
              </div>
            )}
          </div>
        ))}
        </div>
      </ScrollArea>
      {(!isLoading || terminalInputState === TerminalInputState.AwaitingJobDescription) && currentPhase === TerminalPhase.Idle ? (
         <form onSubmit={handleSubmit} className="mt-2 flex">
          {terminalInputState === TerminalInputState.Idle ? (
             <span className="text-[hsl(var(--accent))]">{username}@{hostname}:{currentPath}$</span>
          ) : (
            <span className="text-[hsl(var(--accent))]">&gt;</span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="ml-2 flex-1 border-none bg-transparent text-[hsl(var(--foreground))] outline-none"
            autoFocus
            disabled={isLoading && terminalInputState !== TerminalInputState.AwaitingJobDescription}
          />
        </form>
      ) : (
         <div className="mt-2 flex h-6"> {/* Keep space for prompt even when loading */}
            {currentPhase !== TerminalPhase.Installing && currentPhase !== TerminalPhase.BootingText && currentPhase !== TerminalPhase.Welcoming && (
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
    
