'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { lineLength, totalLength, type Line, type Seg } from './tty';

interface TerminalOutputProps {
  lines: Line[];
  /** Type the output out character by character. */
  animate?: boolean;
  /** Upper bound for the whole typing animation, in ms. Long outputs type faster. */
  maxDuration?: number;
  onFinished?: () => void;
  /** Called when a clickable command inside the output is clicked. */
  onRun?: (command: string) => void;
}

const TICK_MS = 16;

const toneClass: Record<NonNullable<Seg['tone']>, string> = {
  accent: 'text-[hsl(var(--accent))]',
  muted: 'opacity-70',
  strong: 'font-semibold',
};

function renderSegs(segs: Seg[], budget: number, onRun?: (command: string) => void): [React.ReactNode[], number] {
  const nodes: React.ReactNode[] = [];
  let remaining = budget;
  segs.forEach((seg, i) => {
    if (remaining <= 0) return;
    const text = seg.text.slice(0, remaining);
    remaining -= text.length;
    const tone = seg.tone ? toneClass[seg.tone] : undefined;
    if (seg.cmd) {
      const command = seg.cmd;
      nodes.push(
        <button
          key={i}
          type="button"
          className={`tty-cmd ${tone ?? ''}`}
          title={`Run: ${command}`}
          onClick={(event) => {
            event.stopPropagation();
            onRun?.(command);
          }}
        >
          {text}
        </button>
      );
    } else if (seg.href) {
      const external = !seg.href.startsWith('mailto:');
      nodes.push(
        <a
          key={i}
          href={seg.href}
          className="tty-link"
          onClick={(event) => event.stopPropagation()}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {text}
        </a>
      );
    } else {
      nodes.push(
        <span key={i} className={tone}>
          {text}
        </span>
      );
    }
  });
  return [nodes, budget - remaining];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({
  lines,
  animate = true,
  maxDuration = 1200,
  onFinished,
  onRun,
}) => {
  const total = useMemo(() => totalLength(lines), [lines]);
  const [shown, setShown] = useState(animate ? 0 : total);
  const finishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinishedRef.current?.();
    };

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animate || total === 0 || reducedMotion) {
      setShown(total);
      finish();
      return;
    }

    const step = Math.max(1, Math.ceil(total / (maxDuration / TICK_MS)));
    let count = 0;
    const timer = window.setInterval(() => {
      count = Math.min(total, count + step);
      setShown(count);
      if (count >= total) {
        window.clearInterval(timer);
        finish();
      }
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [animate, total, maxDuration]);

  const rendered: React.ReactNode[] = [];
  let remaining = shown;
  for (let i = 0; i < lines.length && remaining > 0; i++) {
    const current = lines[i];
    const take = Math.min(lineLength(current), remaining);
    remaining -= take;

    const indent = current.indent ?? 0;
    const hang = current.hang ?? 0;

    if (current.key) {
      const [keyNodes, used] = renderSegs(current.key, take, onRun);
      const [valueNodes] = renderSegs(current.segs, take - used, onRun);
      rendered.push(
        <div key={i} className="flex" style={{ paddingLeft: `${indent}ch` }}>
          <span className="shrink-0" style={{ width: `${current.keyWidth ?? 16}ch` }}>
            {keyNodes}
          </span>
          <span className="min-w-0 flex-1">{valueNodes}</span>
        </div>
      );
      continue;
    }

    const [nodes] = renderSegs(current.segs, take, onRun);
    rendered.push(
      <div
        key={i}
        style={
          indent || hang
            ? { paddingLeft: `${indent + hang}ch`, textIndent: hang ? `-${hang}ch` : undefined }
            : undefined
        }
      >
        {nodes.length > 0 ? nodes : ' '}
      </div>
    );
  }

  return <div className="tty-output">{rendered}</div>;
};

export default TerminalOutput;
