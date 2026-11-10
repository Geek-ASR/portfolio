'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { findNode, getRootFileContent, resolvePath, welcomeMessage } from '@/lib/file-system';
import { profile, projects, withBase } from '@/lib/portfolio-data';
import InstallationProgress from './InstallationProgress';
import TerminalOutput from './TerminalOutput';
import { line, textToLines, type Line, type Seg } from './tty';

interface CommandHistoryItem {
  id: number;
  /** A prompt line echoing what was typed. */
  command?: string;
  path?: string;
  isInput?: boolean;
  /** Typed, clickable output. */
  lines?: Line[];
  maxDuration?: number;
  onFinished?: () => void;
  /** Arbitrary output (the installation progress bar). */
  node?: React.ReactNode;
}

enum TerminalPhase {
  Installing,
  Welcoming,
  Idle,
}

interface TerminalProps {
  /** Called by the `gui` command. */
  onSwitchToGui?: () => void;
}

interface HelpEntry {
  name: string;
  args?: string;
  description: string;
  /** What a click types into the prompt. Defaults to the command name. */
  run?: (currentPath: string) => string;
}

const HELP: HelpEntry[] = [
  { name: 'about_me', description: 'Display information about me' },
  { name: 'education', description: 'Display my educational background' },
  { name: 'skills', description: 'List my technical skills' },
  { name: 'ls', args: '[dir]', description: 'List directory contents (e.g., ls projects)' },
  { name: 'experience', description: 'Display my work experience' },
  { name: 'projects', description: 'List my projects' },
  { name: 'research', description: 'Display my research paper' },
  { name: 'certifications', description: 'Display my certifications' },
  { name: 'achievements', description: 'Display my achievements' },
  { name: 'contacts', description: 'Show contact information' },
  { name: 'cd', args: '[dir]', description: 'Change directory', run: (path) => (path === '~' ? 'cd projects' : 'cd ..') },
  { name: 'cat', args: '[file]', description: 'Display file content', run: () => 'cat ~/README.md' },
  { name: 'open', args: '[file]', description: 'Open a file (e.g., resume.pdf)', run: () => 'open ~/resume.pdf' },
  { name: 'export', description: 'Download resume.pdf' },
  { name: 'gui', description: 'Switch to GUI mode' },
  { name: 'whoami', description: 'Display current user' },
  { name: 'date', description: 'Display current date' },
  { name: 'echo', args: '[text]', description: 'Display text', run: () => 'echo Hello, World!' },
  { name: 'help', description: 'Show this list of commands' },
  { name: 'clear', description: 'Clear the terminal screen' },
];

const COMMAND_NAMES = HELP.map((entry) => entry.name);

/** One-tap shortcuts shown above the prompt on phones, where typing is slow. */
const QUICK_COMMANDS = [
  'help',
  'about_me',
  'experience',
  'projects',
  'research',
  'certifications',
  'skills',
  'education',
  'achievements',
  'contacts',
  'gui',
  'clear',
];

/** Commands that simply print a file from the home directory. */
const FILE_COMMANDS: Record<string, string> = {
  about_me: 'about_me.txt',
  education: 'education.txt',
  skills: 'skills.txt',
  experience: 'experience.txt',
  research: 'research.txt',
  certifications: 'certifications.txt',
  achievements: 'achievements.txt',
  contacts: 'contacts.txt',
};

const AUTO_TYPE_MS = 45;
const AUTO_RUN_DELAY_MS = 260;

const username = 'user';
const hostname = 'ASRWorkspace';

/** Make the quoted commands in the welcome message clickable. */
const welcomeLines = (): Line[] =>
  welcomeMessage.split('\n').map((text) => {
    const segs: Seg[] = [];
    let last = 0;
    for (const match of text.matchAll(/'(help|gui)'/g)) {
      const start = match.index ?? 0;
      segs.push({ text: text.slice(last, start + 1) });
      segs.push({ text: match[1], cmd: match[1], tone: 'accent' });
      last = start + 1 + match[1].length;
    }
    segs.push({ text: text.slice(last) });
    return { segs };
  });

const Prompt: React.FC<{ path: string }> = ({ path }) => (
  <span className="shrink-0 text-[hsl(var(--accent))]">
    {username}@{hostname}:{path}$
  </span>
);

const Terminal: React.FC<TerminalProps> = ({ onSwitchToGui }) => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<TerminalPhase>(TerminalPhase.Installing);
  /** Text being "typed" into the prompt after a command was clicked (null = not auto-typing). */
  const [autoTyped, setAutoTyped] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const booted = useRef(false);
  const timers = useRef<number[]>([]);
  const typedCommands = useRef<string[]>([]);
  const historyCursor = useRef<number | null>(null);
  const coarsePointer = useRef(false);

  const idle = !isLoading && currentPhase === TerminalPhase.Idle && autoTyped === null;

  const scrollToBottom = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, []);

  // Keep the newest output in view, also while it is still being typed out.
  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(scrollToBottom);
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);

  useEffect(scrollToBottom, [history, autoTyped, idle, scrollToBottom]);

  useEffect(() => {
    coarsePointer.current = window.matchMedia('(pointer: coarse)').matches;
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  /** Focus the prompt without opening the on-screen keyboard or yanking the page back up. */
  const focusInput = useCallback((force = false) => {
    const input = inputRef.current;
    const root = rootRef.current;
    if (!input || !root) return;
    if (!force) {
      if (coarsePointer.current) return;
      const rect = root.getBoundingClientRect();
      const visible = rect.bottom > window.innerHeight * 0.4 && rect.top < window.innerHeight * 0.6;
      if (!visible) return;
    }
    input.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (idle) focusInput();
  }, [idle, focusInput]);

  // Hand the keyboard back to the page once the terminal is scrolled away (so
  // Space and the arrow keys scroll the GUI), and take it again on return.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) focusInput();
        else if (document.activeElement === inputRef.current) inputRef.current?.blur();
      },
      { threshold: 0.5 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [focusInput]);

  const addHistory = useCallback((item: Omit<CommandHistoryItem, 'id'>) => {
    nextId.current += 1;
    const id = nextId.current;
    setHistory((prev) => [...prev, { ...item, id }]);
  }, []);

  // Boot sequence: installation progress bar, then the welcome message.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    addHistory({
      node: <InstallationProgress onFinished={() => setCurrentPhase(TerminalPhase.Welcoming)} />,
    });
  }, [addHistory]);

  useEffect(() => {
    if (currentPhase !== TerminalPhase.Welcoming) return;
    addHistory({
      lines: welcomeLines(),
      maxDuration: 2600,
      onFinished: () => {
        setCurrentPhase(TerminalPhase.Idle);
        setIsLoading(false);
      },
    });
  }, [currentPhase, addHistory]);

  const downloadResume = useCallback(() => {
    const link = document.createElement('a');
    link.href = withBase(profile.resumeFile);
    link.setAttribute('download', profile.resumeDownloadName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  /** Run a command and return its output. `null` means "no output". */
  const execute = useCallback(
    (commandInput: string): { lines: Line[] | null; onFinished?: () => void; clear?: boolean } => {
      const [command, ...args] = commandInput.trim().split(/\s+/);
      const name = command.toLowerCase();

      if (name in FILE_COMMANDS) {
        return { lines: textToLines(getRootFileContent(FILE_COMMANDS[name]) ?? '') };
      }

      switch (name) {
        case 'help':
          return {
            lines: [
              line('Available commands:'),
              ...HELP.map(
                (entry): Line => ({
                  indent: 2,
                  keyWidth: 17,
                  key: [
                    { text: entry.name, cmd: entry.run ? entry.run(currentPath) : entry.name, tone: 'accent' },
                    ...(entry.args ? [{ text: ` ${entry.args}`, tone: 'muted' as const }] : []),
                  ],
                  segs: [{ text: entry.description }],
                })
              ),
            ],
          };

        case 'projects':
          return {
            lines: [
              line(`Projects (${projects.length}) - click a name to open it:`),
              ...projects.flatMap((project): Line[] => [
                {
                  indent: 2,
                  segs: [
                    { text: project.name, cmd: `cat ~/projects/${project.file}`, tone: 'accent' },
                    { text: `  ${project.period.replace(/ /g, '\u00A0')}`, tone: 'muted' },
                  ],
                },
                { indent: 4, segs: [{ text: project.domain }] },
              ]),
            ],
          };

        case 'ls': {
          const target = args[0] ? resolvePath(args[0], currentPath) : currentPath;
          const node = findNode(target);
          if (node && node.type === 'directory') {
            if (node.children.length === 0) return { lines: [line('Directory is empty.')] };
            return {
              lines: node.children.map((child): Line => {
                const childPath = `${target}/${child.name}`;
                if (child.type === 'directory') {
                  return { segs: [{ text: `${child.name}/`, cmd: `cd ${childPath}`, tone: 'accent' }] };
                }
                return { segs: [{ text: child.name, cmd: `${child.url ? 'open' : 'cat'} ${childPath}` }] };
              }),
            };
          }
          if (node && node.type === 'file') return { lines: [line(args[0] ?? node.name)] };
          return { lines: [line(`ls: cannot access '${args[0] || '.'}': No such file or directory`)] };
        }

        case 'cd': {
          const targetDir = args[0];
          if (!targetDir) return { lines: [line('Usage: cd [directory]')] };
          const newPath = resolvePath(targetDir, currentPath);
          const node = findNode(newPath);
          if (node && node.type === 'directory') {
            setCurrentPath(newPath);
            return { lines: null };
          }
          return { lines: [line(`cd: no such file or directory: ${targetDir}`)] };
        }

        case 'cat': {
          const fileToCat = args[0];
          if (!fileToCat) return { lines: [line('Usage: cat [filename]')] };
          const node = findNode(resolvePath(fileToCat, currentPath));
          if (node && node.type === 'file' && node.content) return { lines: textToLines(node.content) };
          if (node && node.type === 'file') {
            return {
              lines: [
                {
                  segs: [
                    { text: `cat: ${fileToCat}: File is not a text file, is empty, or cannot be displayed. Try ` },
                    { text: `open ${fileToCat}`, cmd: `open ${resolvePath(fileToCat, currentPath)}`, tone: 'accent' },
                    { text: " if it's a special file type." },
                  ],
                },
              ],
            };
          }
          if (node && node.type === 'directory') return { lines: [line(`cat: ${fileToCat}: Is a directory`)] };
          return { lines: [line(`cat: ${fileToCat}: No such file or directory`)] };
        }

        case 'open': {
          const fileToOpen = args[0];
          if (!fileToOpen) return { lines: [line('Usage: open [filename]')] };
          const node = findNode(resolvePath(fileToOpen, currentPath));
          if (node && node.type === 'file' && node.url) {
            window.open(node.url, '_blank', 'noopener');
            return {
              lines: [
                {
                  segs: [
                    { text: `Opening ${fileToOpen}... ` },
                    { text: '(click here if it did not open)', href: node.url },
                  ],
                },
              ],
            };
          }
          if (node && node.type === 'directory') return { lines: [line(`open: ${fileToOpen} is a directory. Use 'cd'.`)] };
          if (node && node.type === 'file') {
            return {
              lines: [
                {
                  segs: [
                    { text: `open: ${fileToOpen}: This file type cannot be opened directly. Try ` },
                    { text: `cat ${fileToOpen}`, cmd: `cat ${resolvePath(fileToOpen, currentPath)}`, tone: 'accent' },
                    { text: " if it's a text file." },
                  ],
                },
              ],
            };
          }
          return { lines: [line(`open: ${fileToOpen}: No such file or cannot be opened.`)] };
        }

        case 'clear':
          return { lines: null, clear: true };

        case 'whoami':
          return { lines: [line(username)] };

        case 'date':
          return { lines: [line(new Date().toString())] };

        case 'echo':
          return { lines: [line(commandInput.trim().slice(command.length).trim())] };

        case 'export':
          downloadResume();
          return {
            lines: [
              {
                segs: [
                  { text: 'Downloading resume.pdf... ' },
                  { text: '(click here if it did not start)', href: withBase(profile.resumeFile) },
                ],
              },
            ],
          };

        case 'gui':
          return { lines: [line('Switching to GUI mode...')], onFinished: onSwitchToGui };

        default:
          return {
            lines: [
              {
                segs: [
                  { text: `Command not found: ${command}. Type ` },
                  { text: 'help', cmd: 'help', tone: 'accent' },
                  { text: ' for a list of commands.' },
                ],
              },
            ],
          };
      }
    },
    [currentPath, downloadResume, onSwitchToGui]
  );

  const runCommand = useCallback(
    (rawInput: string) => {
      addHistory({ command: rawInput, path: currentPath, isInput: true });
      historyCursor.current = null;

      const commandInput = rawInput.trim();
      if (commandInput === '') return;

      if (typedCommands.current[typedCommands.current.length - 1] !== commandInput) {
        typedCommands.current.push(commandInput);
      }

      setIsLoading(true);
      const result = execute(commandInput);

      if (result.clear) {
        setHistory([]);
        setIsLoading(false);
        return;
      }
      if (!result.lines || result.lines.length === 0) {
        setIsLoading(false);
        return;
      }
      addHistory({
        lines: result.lines,
        onFinished: () => {
          setIsLoading(false);
          result.onFinished?.();
        },
      });
    },
    [addHistory, currentPath, execute]
  );

  /** A command was clicked: type it into the prompt like a person would, then run it. */
  const typeAndRun = useCallback(
    (command: string) => {
      if (!idle) return;
      setInputValue('');
      setAutoTyped('');
      let typed = 0;
      const typeNext = () => {
        typed += 1;
        setAutoTyped(command.slice(0, typed));
        if (typed < command.length) {
          timers.current.push(window.setTimeout(typeNext, AUTO_TYPE_MS));
          return;
        }
        timers.current.push(
          window.setTimeout(() => {
            timers.current = [];
            setAutoTyped(null);
            runCommand(command);
          }, AUTO_RUN_DELAY_MS)
        );
      };
      timers.current.push(window.setTimeout(typeNext, AUTO_TYPE_MS));
    },
    [idle, runCommand]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!idle) return;
    runCommand(inputValue);
    setInputValue('');
  };

  /** Tab completion for command names and file paths. */
  const complete = (value: string): string => {
    const tokens = value.split(' ');
    const last = tokens[tokens.length - 1];
    let candidates: string[];
    let prefix = last;
    let head = '';

    if (tokens.length === 1) {
      candidates = COMMAND_NAMES;
    } else {
      const slash = last.lastIndexOf('/');
      head = slash >= 0 ? last.slice(0, slash + 1) : '';
      prefix = slash >= 0 ? last.slice(slash + 1) : last;
      const directory = findNode(resolvePath(head || '.', currentPath));
      if (!directory || directory.type !== 'directory') return value;
      candidates = directory.children.map((child) => (child.type === 'directory' ? `${child.name}/` : child.name));
    }

    const matches = candidates.filter((candidate) => candidate.startsWith(prefix));
    if (matches.length === 0) return value;
    let common = matches[0];
    for (const match of matches) {
      while (!match.startsWith(common)) common = common.slice(0, -1);
    }
    const completed = matches.length === 1 && !common.endsWith('/') ? `${common} ` : common;
    tokens[tokens.length - 1] = head + completed;
    return tokens.join(' ');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!idle) return;
    const commands = typedCommands.current;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commands.length === 0) return;
      const cursor = historyCursor.current === null ? commands.length - 1 : Math.max(0, historyCursor.current - 1);
      historyCursor.current = cursor;
      setInputValue(commands[cursor]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyCursor.current === null) return;
      const cursor = historyCursor.current + 1;
      if (cursor >= commands.length) {
        historyCursor.current = null;
        setInputValue('');
      } else {
        historyCursor.current = cursor;
        setInputValue(commands[cursor]);
      }
    } else if (event.key === 'Tab') {
      if (inputValue === '') return; // keep normal keyboard navigation when there is nothing to complete
      event.preventDefault();
      setInputValue(complete(inputValue));
    } else if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
      event.preventDefault();
      setHistory([]);
    }
  };

  const handleTerminalClick = () => {
    if (!idle) return;
    // Do not steal focus while text is being selected, and do not pop the keyboard open on phones.
    if (window.getSelection()?.toString()) return;
    focusInput();
  };

  return (
    <div
      ref={rootRef}
      className="terminal flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[hsl(var(--background))] p-3 font-mono text-[13px] leading-relaxed text-[hsl(var(--foreground))] sm:p-4 sm:text-sm md:text-base"
      onClick={handleTerminalClick}
    >
      <div ref={viewportRef} className="terminal-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div ref={contentRef} className="pr-1 sm:pr-16">
          {history.map((item) => (
            <div key={item.id}>
              {item.isInput && (
                <div className="flex flex-wrap gap-x-2">
                  <Prompt path={item.path || currentPath} />
                  <span className="min-w-0 flex-1 whitespace-pre-wrap">{item.command}</span>
                </div>
              )}
              {item.node && <div className="my-2">{item.node}</div>}
              {item.lines && (
                <TerminalOutput
                  lines={item.lines}
                  maxDuration={item.maxDuration}
                  onFinished={item.onFinished}
                  onRun={typeAndRun}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {currentPhase === TerminalPhase.Idle ? (
        <>
          <div className="terminal-chips -mx-3 mt-2 shrink-0 gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4" role="toolbar" aria-label="Quick commands">
            {QUICK_COMMANDS.map((command) => (
              <button
                key={command}
                type="button"
                disabled={!idle}
                onClick={(event) => {
                  event.stopPropagation();
                  typeAndRun(command);
                }}
                className="shrink-0 rounded border border-[hsl(var(--accent))]/40 px-2.5 py-1.5 text-[12px] leading-none text-[hsl(var(--accent))] transition-colors active:bg-[hsl(var(--accent))]/20 disabled:opacity-40"
              >
                {command}
              </button>
            ))}
          </div>

          {/* The input stays mounted (and focused) while a command runs, so the
              on-screen keyboard does not collapse between commands. */}
          <form
            onSubmit={handleSubmit}
            onClick={(event) => {
              event.stopPropagation();
              if (idle) focusInput(true);
            }}
            className="relative mt-2 flex min-h-[1.625em] shrink-0 gap-x-2"
          >
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command
            </label>
            <Prompt path={currentPath} />
            {autoTyped !== null && (
              <span className="min-w-0 flex-1 whitespace-pre-wrap">
                {autoTyped}
                <span className="terminal-cursor" aria-hidden="true" />
              </span>
            )}
            {isLoading && autoTyped === null && <span>Processing...</span>}
            <span className={idle ? 'terminal-input-wrap min-w-0 flex-1' : 'pointer-events-none absolute h-px w-px overflow-hidden opacity-0'}>
              <input
                id="terminal-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="terminal-input w-full border-none bg-transparent p-0 text-[hsl(var(--foreground))] caret-[hsl(var(--accent))] outline-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="go"
                aria-hidden={!idle}
              />
            </span>
          </form>
        </>
      ) : (
        <div className="mt-2 min-h-[1.625em] shrink-0" />
      )}
    </div>
  );
};

export default Terminal;
