'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, MotionConfig, useInView } from 'framer-motion';
import {
  Award,
  BookOpen,
  Briefcase,
  Building,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  FileCode2,
  FileText,
  Github,
  GraduationCap,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ScrollText,
  TerminalSquare,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WaveBackground from '@/components/ui/wave-background';
import TypingEffect from '@/components/terminal/TypingEffect';
import { cn } from '@/lib/utils';
import {
  achievements,
  certifications,
  education,
  experience,
  profile,
  projects,
  research,
  skills,
  socials,
  withBase,
  type Project,
  type ResearchPaper,
} from '@/lib/portfolio-data';
import profilePhoto from '@/assets/profile.jpeg';

interface PortfolioProps {
  /** Scrolls back up to the terminal. */
  onOpenTerminal: () => void;
}

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
] as const;

const socialIcons: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  GeeksforGeeks: FileCode2,
  ORCID: ScrollText,
};

const gradientText = 'bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue bg-clip-text text-transparent';
const mutedText = 'text-[hsl(var(--muted))]';
const linkClass =
  'inline-flex items-center gap-2 rounded-sm text-sm text-[hsl(var(--accent))] underline-offset-4 transition-colors hover:text-electricBlue hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]';
const pillButton =
  'inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]';
const pillOutline = `${pillButton} border-[hsl(var(--accent))]/50 bg-white/5 text-[hsl(var(--foreground))] hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/15 hover:text-[hsl(var(--accent))]`;
const pillSolid = `${pillButton} border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-electricBlue hover:border-electricBlue`;

const revealViewport = { once: true, amount: 0, margin: '0px 0px -12% 0px' } as const;

/* -------------------------------------------------------------------------- */
/* Building blocks                                                            */
/* -------------------------------------------------------------------------- */

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="section-anchor">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-[hsl(var(--accent))]/30 bg-card/10 shadow-xl backdrop-blur-md">
        <CardHeader className="p-5 sm:p-6 md:p-8">
          <CardTitle id={`${id}-title`} className={cn('pb-2 text-2xl font-bold sm:text-3xl', gradientText)}>
            {title}
          </CardTitle>
          <div className="h-0.5 w-1/4 bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue shadow-[0_0_8px_hsl(var(--accent)),_0_0_12px_hsl(var(--accent))]" />
        </CardHeader>
        <CardContent className="p-5 pt-0 text-base leading-relaxed text-[hsl(var(--foreground))] sm:p-6 sm:pt-0 md:p-8 md:pt-0">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  </section>
);

const TagList: React.FC<{ tags: string[] }> = ({ tags }) => (
  <ul className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <li key={tag}>
        <Badge
          variant="secondary"
          className="border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 px-2.5 py-1 text-xs font-medium text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/20 sm:text-sm"
        >
          {tag}
        </Badge>
      </li>
    ))}
  </ul>
);

const ExternalAnchor: React.FC<{ href: string; icon: LucideIcon; children: React.ReactNode }> = ({
  href,
  icon: Icon,
  children,
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    <Icon size={18} aria-hidden="true" className="shrink-0" />
    {children}
  </a>
);

/** Letters fade in one by one, then keep cycling through the accent colour like a wave. */
const WaveText: React.FC<{ text: string; offset?: number; className?: string }> = ({ text, offset = 0, className }) => (
  <span aria-hidden="true" className={className}>
    {text.split('').map((char, index) => (
      <motion.span
        key={index}
        className="hero-wave-letter inline-block"
        style={{ animationDelay: `${(offset + index) * 90}ms` }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 + (offset + index) * 0.05 }}
      >
        {char === ' ' ? ' ' : char}
      </motion.span>
    ))}
  </span>
);

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const GuiNav: React.FC<{ onOpenTerminal: () => void }> = ({ onOpenTerminal }) => {
  const [active, setActive] = useState<string>('');
  const listRef = useRef<HTMLUListElement>(null);

  // Highlight the section that is currently in the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  // Keep the active link visible inside the horizontally scrollable link list.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!list || !link) return;
    const target = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [active]);

  return (
    <nav
      aria-label="Portfolio sections"
      className="sticky top-0 z-30 border-b border-[hsl(var(--accent))]/20 bg-[#0f2027]/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onOpenTerminal}
          className="group my-2 inline-flex shrink-0 items-center gap-2 rounded-md border border-[hsl(var(--accent))]/50 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--accent))]/15 hover:text-[hsl(var(--accent))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))] sm:text-sm"
          aria-label="Back to Terminal"
        >
          <TerminalSquare className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
          <span className="hidden min-[380px]:inline">Terminal</span>
        </button>
        <ul ref={listRef} className="no-scrollbar nav-fade relative flex min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:justify-end">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                data-section={id}
                aria-current={active === id ? 'true' : undefined}
                className={cn(
                  'block rounded-md px-2.5 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--ring))] sm:px-3',
                  active === id
                    ? 'text-[hsl(var(--accent))] text-glow-soft'
                    : 'text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--foreground))]'
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [startSubtitle, setStartSubtitle] = useState(false);
  const line1 = 'Hello, I am';
  const line2 = profile.name;
  const subtitle = profile.roles.join(' | ');

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setStartSubtitle(true), (line1.length + line2.length) * 60 + 300);
    return () => clearTimeout(timer);
  }, [inView, line1.length, line2.length]);

  return (
    <header ref={ref} className="relative flex min-h-[calc(100svh-3rem)] flex-col items-center justify-center px-4 pb-24 pt-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-[5] flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8"
      >
        <Image
          src={profilePhoto}
          alt="Portrait of Aditya Rekhe"
          width={180}
          height={180}
          sizes="180px"
          placeholder="blur"
          className="hero-photo box-content h-36 w-36 rounded-full border-4 border-[hsl(var(--accent))] object-cover object-[50%_22%] p-1 sm:h-44 sm:w-44"
        />
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="sr-only">
            {line1} {line2}
          </span>
          <WaveText text={line1} className="block" />
          <WaveText text={line2} offset={line1.length + 1} className="mt-1 block font-extrabold" />
        </h1>
        <p className="min-h-[3.5rem] sm:min-h-[2.5rem]" aria-label={subtitle}>
          {startSubtitle && (
            <TypingEffect
              text={subtitle}
              speed={45}
              className={cn('block text-base tracking-wide sm:text-xl lg:text-2xl', mutedText)}
            />
          )}
        </p>
        <p className={cn('-mt-2 inline-flex items-center gap-2 text-sm', mutedText)}>
          <MapPin size={16} className="text-[hsl(var(--accent))]" aria-hidden="true" />
          {profile.location}
        </p>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3 sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center">
          <a href={withBase(profile.resumeFile)} download={profile.resumeDownloadName} className={pillSolid}>
            <Download size={16} aria-hidden="true" />
            Resume
          </a>
          <a href={socials[0].url} target="_blank" rel="noopener noreferrer" className={pillOutline}>
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>
          <a href={socials[1].url} target="_blank" rel="noopener noreferrer" className={pillOutline}>
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className={pillOutline}>
            <Mail size={16} aria-hidden="true" />
            Email
          </a>
        </div>
      </motion.div>
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))]"
      >
        <ChevronDown className="h-8 w-8 animate-scroll-indicator-bounce text-[hsl(var(--accent))]" aria-hidden="true" />
      </a>
    </header>
  );
};

const About: React.FC = () => (
  <Section id="about" title="About Me">
    <p className={cn('mb-8 max-w-4xl', mutedText)}>{profile.now}</p>
    <ul className="space-y-5">
      <li className="flex items-start">
        <Lightbulb className="mr-3 mt-1 h-6 w-6 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
        <span>
          A <strong>quick learner</strong>, eager to explore new <strong>technologies</strong> and{' '}
          <strong>environments</strong>.
        </span>
      </li>
      <li className="flex items-start">
        <Zap className="mr-3 mt-1 h-6 w-6 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
        <span>
          Passionate for <strong>innovative solutions</strong> and <strong>programming</strong>.
        </span>
      </li>
      <li className="flex items-start">
        <GraduationCap className="mr-3 mt-1 h-6 w-6 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
        <span>
          Embraces <strong>challenges</strong> as opportunities for <strong>growth</strong>, constantly seeking to expand{' '}
          <strong>skill set</strong>.
        </span>
      </li>
      <li className="flex items-start">
        <Building className="mr-3 mt-1 h-6 w-6 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
        <span>
          Ready to contribute with an <strong>adaptable nature</strong> and <strong>enthusiasm</strong> to any project or
          team.
        </span>
      </li>
    </ul>
    <ul className="mt-10 flex items-center justify-center gap-6">
      {socials.map((link) => {
        const Icon = socialIcons[link.name] ?? ExternalLink;
        return (
          <li key={link.name}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Aditya Rekhe on ${link.name}`}
              title={link.name}
              className="group block rounded-full p-1 text-white transition-colors hover:text-[hsl(var(--accent))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))]"
            >
              <Icon size={30} className="group-hover:animate-pulse-social" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  </Section>
);

const Experience: React.FC = () => (
  <Section id="experience" title="Experience">
    <ol className="relative space-y-10 before:absolute before:inset-y-0 before:left-[5px] before:w-0.5 before:bg-[hsl(var(--accent))]/30">
      {experience.map((item, index) => (
        <motion.li
          key={item.org}
          className="relative pl-8 sm:pl-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <span
            className="absolute left-0 top-2 z-10 h-3 w-3 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_10px_hsl(var(--accent))]"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-x-4 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-lg font-semibold sm:text-xl">{item.org}</h3>
            <p className={cn('shrink-0 text-sm', mutedText)}>{item.period}</p>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-medium text-[hsl(var(--primary))] sm:text-lg">
            <span className="inline-flex items-center gap-2">
              {item.kind === 'work' ? (
                <Briefcase size={16} className="text-[hsl(var(--accent))]" aria-hidden="true" />
              ) : (
                <Users size={16} className="text-[hsl(var(--accent))]" aria-hidden="true" />
              )}
              {item.role}
            </span>
            {item.location && <span className={cn('text-sm font-normal', mutedText)}>{item.location}</span>}
          </p>
          <ul className={cn('mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-[hsl(var(--accent))]', mutedText)}>
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  </Section>
);

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={revealViewport}
    transition={{ duration: 0.45, delay: (index % 2) * 0.08 }}
    className="flex"
  >
    <Card className="flex w-full flex-col overflow-hidden rounded-xl border border-[hsl(var(--accent))]/20 bg-card/10 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[hsl(var(--accent))]/50 hover:shadow-[0_10px_30px_hsl(var(--accent)/0.15)]">
      <CardHeader className="space-y-1 border-b border-[hsl(var(--accent))]/20 bg-black/10 p-5 sm:p-6">
        <CardTitle className={cn('text-xl font-semibold leading-snug sm:text-2xl', gradientText)}>{project.name}</CardTitle>
        <p className="text-sm font-medium text-[hsl(var(--primary))]">{project.domain}</p>
        <p className={cn('text-xs sm:text-sm', mutedText)}>
          {project.period}
          {project.team ? ` · ${project.team}` : ''}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <p className={cn('text-sm leading-relaxed', mutedText)}>{project.description}</p>
        {project.highlights && project.highlights.length > 0 && (
          <ul className={cn('list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-[hsl(var(--accent))]', mutedText)}>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
        <div>
          <h4 className="mb-2.5 text-sm font-medium uppercase tracking-wider text-[hsl(var(--primary))]/80">
            {project.tagLabel ?? 'Tech Stack'}
          </h4>
          <TagList tags={project.tech} />
        </div>
        {(project.github || project.website || project.paper) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            {project.github && (
              <ExternalAnchor href={project.github} icon={Github}>
                GitHub Repository
              </ExternalAnchor>
            )}
            {project.website && (
              <ExternalAnchor href={project.website} icon={ExternalLink}>
                Live Website
              </ExternalAnchor>
            )}
            {project.paper && (
              <ExternalAnchor href={project.paper} icon={FileText}>
                Research Paper
              </ExternalAnchor>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.li>
);

const Projects: React.FC = () => {
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);
  return (
    <Section id="projects" title="Projects">
      <ul className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {featured.map((project, index) => (
          <ProjectCard key={project.file} project={project} index={index} />
        ))}
      </ul>
      <h3 className="mb-5 mt-12 text-xl font-semibold text-[hsl(var(--primary))] sm:text-2xl">More Projects</h3>
      <ul className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {more.map((project, index) => (
          <ProjectCard key={project.file} project={project} index={index} />
        ))}
      </ul>
    </Section>
  );
};

const PaperCard: React.FC<{ paper: ResearchPaper }> = ({ paper }) => {
  const [copied, setCopied] = useState(false);

  const copyBibtex = async () => {
    try {
      await navigator.clipboard.writeText(paper.bibtex);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): fall back to a hidden textarea.
      const area = document.createElement('textarea');
      area.value = paper.bibtex;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="rounded-xl border border-[hsl(var(--accent))]/20 bg-white/5 p-5 shadow-md sm:p-7">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge className="border-transparent bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent))]">
          Preprint
        </Badge>
        <span className={cn('text-sm', mutedText)}>
          {paper.venue} · {paper.year}
        </span>
      </div>
      <h3 className="text-xl font-semibold leading-snug sm:text-2xl">{paper.title}</h3>
      <p className="mt-2 text-sm text-[hsl(var(--primary))]">
        {paper.authors} <span className={mutedText}>· {paper.affiliation}</span>
      </p>
      <p className={cn('mt-1 text-xs italic sm:text-sm', mutedText)}>{paper.status}</p>

      <h4 className="mb-2 mt-6 text-sm font-medium uppercase tracking-wider text-[hsl(var(--primary))]/80">Abstract</h4>
      <p className={cn('text-sm leading-relaxed', mutedText)}>{paper.abstract}</p>

      <h4 className="mb-2 mt-6 text-sm font-medium uppercase tracking-wider text-[hsl(var(--primary))]/80">Key Points</h4>
      <ul className={cn('list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-[hsl(var(--accent))]', mutedText)}>
        {paper.findings.map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>

      <h4 className="mb-2.5 mt-6 text-sm font-medium uppercase tracking-wider text-[hsl(var(--primary))]/80">Keywords</h4>
      <TagList tags={paper.keywords} />

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a href={paper.doiUrl} target="_blank" rel="noopener noreferrer" className={pillSolid}>
          <BookOpen size={16} aria-hidden="true" />
          Read Paper
        </a>
        <a href={paper.codeUrl} target="_blank" rel="noopener noreferrer" className={pillOutline}>
          <Github size={16} aria-hidden="true" />
          Code
        </a>
        <button type="button" onClick={copyBibtex} className={pillOutline}>
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy BibTeX'}</span>
        </button>
      </div>
      <dl className={cn('mt-5 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-[auto_1fr] sm:text-sm', mutedText)}>
        <dt className="font-medium text-[hsl(var(--primary))]/80">Paper + dataset DOI</dt>
        <dd className="mb-2 break-all sm:mb-0">
          <a href={paper.doiUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--accent))] hover:underline">
            {paper.doi}
          </a>
        </dd>
        <dt className="font-medium text-[hsl(var(--primary))]/80">Software DOI</dt>
        <dd className="mb-2 break-all sm:mb-0">
          <a href={paper.softwareDoiUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--accent))] hover:underline">
            {paper.softwareDoi}
          </a>
        </dd>
        <dt className="font-medium text-[hsl(var(--primary))]/80">License</dt>
        <dd>{paper.license}</dd>
      </dl>
    </article>
  );
};

const Research: React.FC = () => (
  <Section id="research" title="Research">
    <div className="space-y-8">
      {research.map((paper) => (
        <PaperCard key={paper.doi} paper={paper} />
      ))}
    </div>
  </Section>
);

const Certifications: React.FC = () => (
  <Section id="certifications" title="Certifications">
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {certifications.map((certification, index) => (
        <motion.li
          key={certification.title}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.3, delay: (index % 2) * 0.08 }}
          className="flex gap-4 rounded-lg border border-[hsl(var(--accent))]/20 bg-white/5 p-5 shadow-md transition-colors duration-300 hover:border-[hsl(var(--accent))]/50"
        >
          <Award className="mt-0.5 h-8 w-8 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold sm:text-lg">{certification.title}</h3>
              <Badge variant="secondary" className="border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 text-xs text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10">
                {certification.type}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[hsl(var(--primary))]">{certification.issuer}</p>
            <p className={cn('text-xs sm:text-sm', mutedText)}>{certification.date}</p>
            <p className={cn('mt-2 text-sm leading-relaxed', mutedText)}>{certification.description}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  </Section>
);

const Skills: React.FC = () => (
  <Section id="skills" title="Skills">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {skills.map((group) => (
        <div key={group.category} className="rounded-xl border border-[hsl(var(--accent))]/10 bg-white/5 p-5 shadow-sm sm:p-6">
          <h3 className={cn('mb-4 text-lg font-semibold sm:text-xl', gradientText)}>{group.category}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="rounded-md border border-slate-600/40 bg-slate-700/20 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:border-[hsl(var(--accent))]/60 hover:text-[hsl(var(--accent))] sm:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Section>
);

const Education: React.FC = () => (
  <Section id="education" title="Education">
    <ul className="space-y-8">
      {education.map((item) => (
        <li key={item.degree} className="flex gap-4">
          <GraduationCap className="mt-1 h-6 w-6 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-semibold">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[hsl(var(--accent))]">
                    {item.institution}
                  </a>
                ) : (
                  item.institution
                )}
              </h3>
              <p className={cn('shrink-0 text-sm', mutedText)}>{item.period}</p>
            </div>
            {item.affiliation && <p className={cn('text-sm', mutedText)}>{item.affiliation}</p>}
            <div className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between">
              <p>{item.degree}</p>
              <p className={cn('shrink-0 text-sm', mutedText)}>{item.score}</p>
            </div>
            {item.notes?.map((note) => (
              <p key={note} className="text-sm text-[hsl(var(--accent))]">
                {note}
              </p>
            ))}
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

const Achievements: React.FC = () => (
  <Section id="achievements" title="Achievements">
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {achievements.map((achievement, index) => (
        <motion.li
          key={achievement}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.3, delay: (index % 2) * 0.08 }}
          className="flex items-center gap-4 rounded-lg border border-[hsl(var(--accent))]/20 bg-white/5 p-4 shadow-md transition-colors duration-300 hover:border-[hsl(var(--accent))]/50"
        >
          <Trophy className="h-8 w-8 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
          <span className="text-sm leading-relaxed">{achievement}</span>
        </motion.li>
      ))}
    </ul>
  </Section>
);

const Contact: React.FC = () => (
  <Section id="contact" title="Contact">
    <p className={cn('mb-6 max-w-3xl', mutedText)}>
      Have an opportunity, a project idea or a question about my work? I would love to hear from you.
    </p>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <ul className="space-y-4">
        <li>
          <a href={`mailto:${profile.email}`} className={cn(linkClass, 'break-all text-base')}>
            <Mail size={18} aria-hidden="true" className="shrink-0" />
            {profile.email}
          </a>
        </li>
        <li>
          <a href={`tel:${profile.phoneHref}`} className={cn(linkClass, 'text-base')}>
            <Phone size={18} aria-hidden="true" className="shrink-0" />
            {profile.phone}
          </a>
        </li>
        <li className={cn('inline-flex items-center gap-2', mutedText)}>
          <MapPin size={18} aria-hidden="true" className="shrink-0 text-[hsl(var(--accent))]" />
          {profile.location}
        </li>
      </ul>
      <ul className="space-y-4">
        {socials.map((link) => {
          const Icon = socialIcons[link.name] ?? ExternalLink;
          return (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={cn(linkClass, 'break-all text-base')}>
                <Icon size={18} aria-hidden="true" className="shrink-0" />
                <span>
                  <span className="sr-only">{link.name}: </span>
                  {link.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
    <div className="mt-8 flex flex-wrap gap-3">
      <a href={`mailto:${profile.email}`} className={pillSolid}>
        <Mail size={16} aria-hidden="true" />
        Say Hello
      </a>
      <a href={withBase(profile.resumeFile)} download={profile.resumeDownloadName} className={pillOutline}>
        <Download size={16} aria-hidden="true" />
        Download Resume
      </a>
    </div>
  </Section>
);

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

const Portfolio: React.FC<PortfolioProps> = ({ onOpenTerminal }) => (
  <MotionConfig reducedMotion="user">
    <div id="gui" className="relative font-sans text-[hsl(var(--foreground))] [overflow-x:clip]">
      <WaveBackground />
      <GuiNav onOpenTerminal={onOpenTerminal} />
      <Hero />
      <div className="relative z-[1] mx-auto grid max-w-[1600px] grid-cols-1 gap-y-12 px-4 pb-16 sm:px-6 md:px-10 lg:gap-y-20 lg:px-16">
        <About />
        <Experience />
        <Projects />
        <Research />
        <Certifications />
        <Skills />
        <Education />
        <Achievements />
        <Contact />
      </div>
      <footer className="relative z-[1] border-t border-[hsl(var(--accent))]/20 bg-black/20 px-6 py-8 text-center text-sm backdrop-blur-sm">
        <p className={mutedText}>&copy; {new Date().getFullYear()} Aditya Rekhe. All rights reserved.</p>
        <p className={cn('mt-1', mutedText)}>Powered by ASR_Workspace</p>
        <button
          type="button"
          onClick={onOpenTerminal}
          className="mt-4 inline-flex items-center gap-2 rounded-sm font-mono text-xs text-[hsl(var(--accent))] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--ring))]"
        >
          <TerminalSquare size={14} aria-hidden="true" />
          cd ~/terminal
        </button>
      </footer>
    </div>
  </MotionConfig>
);

export default Portfolio;
