
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { fileSystem, findNode, getRootFileContent, type Directory, type File as FileSystemFileType } from '@/lib/file-system';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TerminalSquare, User, BookOpen, Wrench, Briefcase, Star, Mail, FolderGit2, Github, Linkedin, FileCode2, Instagram, ArrowLeft, ExternalLink, Image as ImageIcon, Phone } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import TypingEffect from '@/components/terminal/TypingEffect';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MountainParallaxBackground from '@/components/ui/mountain-parallax-background';


const GuiContactLinkParser: React.FC<{ line: string }> = ({ line }) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const urlRegex = /(https?:\/\/[\w\-\.\/\?\#\&\=\%\@\:]+)/g;
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/g;

  interface Match { index: number; length: number; text: string; type: 'url' | 'email'; }
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

  return <>{parts.length > 0 ? parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>) : line}</>;
};

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode; // Icon prop is kept in interface, but not rendered
  children: React.ReactNode;
  className?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const SectionCard: React.FC<SectionCardProps> = React.memo(({ title, icon, children, className, cardRef }) => (
  <Card ref={cardRef} className={cn("shadow-lg border border-white/20 backdrop-blur-sm bg-card/75", className)}>
    <CardHeader className="p-6">
      <CardTitle className="flex items-center text-2xl text-white font-semibold">
        {/* Icon rendering removed here */}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-gray-100 text-base leading-relaxed p-6 pt-0">
      {children}
    </CardContent>
  </Card>
));
SectionCard.displayName = 'SectionCard';

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/Geek-ASR',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/aditya-rekhe-94b27122a/',
  },
  {
    name: 'GeeksforGeeks',
    icon: FileCode2,
    url: 'https://www.geeksforgeeks.org/user/adityare545t/',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: '#', // Placeholder - update this
  },
];

interface SkillInfo {
  name: string;
  logoPath?: string;
  displayName: string;
}

function getSkillInfo(skillText: string): SkillInfo {
  const originalText = skillText.trim();
  let coreSkill = originalText;

  const mainSkillMatch = originalText.match(/^([\w\s\.\-\+]+?)(?:\s*\(.*\)|:\s*.*)?$/);
  if (mainSkillMatch && mainSkillMatch[1]) {
    coreSkill = mainSkillMatch[1].trim();
  } else {
    const colonParts = originalText.split(':');
    if (colonParts.length > 0) {
      coreSkill = colonParts[0].trim();
    }
  }

  const normalizedCoreSkill = coreSkill.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace(/\+/g, 'plus')
    .replace(/&/g, 'and');

  const logoMap: Record<string, string> = {
    'python': 'python.svg',
    'javascript': 'javascript.svg',
    'typescript': 'typescript.svg',
    'java': 'java.svg',
    'c++': 'cplusplus.svg',
    'solidity': 'solidity.svg',
    'rust': 'rust.svg',
    'react': 'react.svg',
    'nextjs': 'nextjs.svg',
    'html5': 'html5.svg',
    'css3': 'css3.svg',
    'tailwindcss': 'tailwindcss.svg',
    'nodejs': 'nodejs.svg',
    'expressjs': 'expressjs.svg',
    'graphql': 'graphql.svg',
    'postgresql': 'postgresql.svg',
    'mysql': 'mysql.svg',
    'mongodb': 'mongodb.svg',
    'git': 'git.svg',
    'github': 'github.svg',
    'gitlab': 'gitlab.svg',
    'docker': 'docker.svg',
    'kubernetes': 'kubernetes.svg',
    'aws': 'aws.svg',
    'firebase': 'firebase.svg',
    'linux': 'linux.svg',
    'ubuntu': 'ubuntu.svg',
    'openzeppelin': 'openzeppelin.png',
    'erc20': 'ethereum.svg',
    'erc721': 'ethereum.svg',
    'erc1155': 'ethereum.svg',
    'hardhat': 'hardhat.svg',
    'truffle': 'truffle.png',
    'ganache': 'ganache.png',
    'remixide': 'remix.svg',
    'web3js': 'web3js.svg',
    'ethersjs': 'ethers.svg',
    'chainlink': 'chainlink.svg',
    'ipfs': 'ipfs.svg',
    'ec2': 'aws-ec2.svg',
    's3': 'aws-s3.svg',
    'lambda': 'aws-lambda.svg',
    'macos': 'apple.svg',
    'windows': 'windows.svg',
    'algorithms': 'brain.svg',
  };

  const logoFileName = logoMap[normalizedCoreSkill];

  return {
    name: coreSkill,
    logoPath: logoFileName ? `/logos/${logoFileName}` : undefined,
    displayName: originalText,
  };
}

export interface ParsedProject {
  id: string;
  domain: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  websiteLink?: string;
  galleryPaths: string[];
}

export function parseProjectContent(content: string | undefined, projectId: string): ParsedProject {
  const project: ParsedProject = {
    id: projectId,
    domain: 'Untitled Project',
    description: 'No description available.',
    techStack: [],
    galleryPaths: [],
  };
  if (!content) return project;

  const lines = content.split('\n');
  let currentKey: keyof Omit<ParsedProject, 'id' | 'galleryPaths'> | 'galleryPaths' | null = null;


  for (const line of lines) {
    const domainMatch = line.match(/^Domain:\s*(.*)/i);
    const descMatch = line.match(/^Description:\s*(.*)/i);
    const techMatch = line.match(/^Tech Stack:\s*(.*)/i);
    const githubMatch = line.match(/^GitHub:\s*(.*)/i);
    const websiteMatch = line.match(/^Website:\s*(.*)/i);
    const galleryHeaderMatch = line.match(/^Gallery:/i);
    const galleryItemMatch = line.match(/^\s*-\s*(.*)/);

    if (domainMatch) {
      project.domain = domainMatch[1].trim();
      currentKey = null;
    } else if (descMatch) {
      project.description = descMatch[1].trim();
      currentKey = 'description';
    } else if (techMatch) {
      project.techStack = techMatch[1].split(',').map(tech => tech.trim()).filter(tech => tech);
      currentKey = null;
    } else if (githubMatch) {
      project.githubLink = githubMatch[1].trim();
      currentKey = null;
    } else if (websiteMatch) {
      project.websiteLink = websiteMatch[1].trim();
      currentKey = null;
    } else if (galleryHeaderMatch) {
      currentKey = 'galleryPaths';
    } else if (galleryItemMatch && currentKey === 'galleryPaths') {
      project.galleryPaths.push(galleryItemMatch[1].trim());
    } else if (currentKey === 'description' && line.trim() !== '') {
      if (project.description === 'No description available.') {
        project.description = line.trim();
      } else {
        project.description += `\n${line.trim()}`;
      }
    }
  }
  project.description = project.description.trim();
  return project;
}

interface FooterContactInfo {
  phone?: string;
  email?: string;
  location?: string;
}

function parseFooterContacts(content: string | undefined): FooterContactInfo {
  if (!content) return {};

  const lines = content.split('\n');
  let phone: string | undefined;
  let email: string | undefined;
  let location: string | undefined;

  const contactDetailLine = lines.find(line => line.includes('@') && /\d{10}/.test(line.replace(/\s|·/g, '')));
  if (contactDetailLine) {
    const emailMatch = contactDetailLine.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/);
    if (emailMatch) {
      email = emailMatch[0];
    }
    const phoneMatch = contactDetailLine.match(/\b\d{10}\b/);
    if (phoneMatch) {
      phone = phoneMatch[0];
    }
  }

  const locationLine = lines.find(line => line.toLowerCase().startsWith('loc:'));
  if (locationLine) {
    location = locationLine.substring(4).trim();
  }

  return { phone, email, location };
}


export default function GuiPage() {
  const aboutMeContent = getRootFileContent('about_me.txt');
  const educationContent = getRootFileContent('education.txt');
  const skillsContent = getRootFileContent('skills.txt');
  const experienceContent = getRootFileContent('experience.txt');
  const achievementsContent = getRootFileContent('achievements.txt');
  const contactsContent = getRootFileContent('contacts.txt');

  const projectsNode = findNode('~/projects');
  const projectsList = projectsNode && projectsNode.type === 'directory' ? projectsNode.children.filter(c => c.type === 'file') as FileSystemFileType[] : [];

  const [startSubtitleAnimation, setStartSubtitleAnimation] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(false);
  const aboutMeRef = useRef<HTMLDivElement>(null);

  const line1Text = "Hello, I am";
  const line2Text = "Aditya Rekhe";
  const subtitleText = "Software Engineer | Full-stack Developer | Blockchain Solutions";


  useEffect(() => {
    const firstLetterOfAdityaIndex = line1Text.length;
    const timeForSubtitleToStart = (firstLetterOfAdityaIndex * 0.07 * 1000);

    const timer = setTimeout(() => {
      setStartSubtitleAnimation(true);
    }, timeForSubtitleToStart);

    return () => clearTimeout(timer);
  }, [line1Text.length]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSocialIcons(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = aboutMeRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  const processSkills = (skillsText: string | undefined) => {
    if (!skillsText) return [];
    const lines = skillsText.split('\n').filter(line => line.trim() !== '' && !line.trim().toUpperCase().startsWith("SKILLS"));
    const skillCategories: { category: string; items: string[] }[] = [];
    let currentCategory: { category: string; items: string[] } | null = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ')) {
        if (currentCategory) {
          currentCategory.items.push(trimmedLine.substring(2).trim());
        } else {
           currentCategory = { category: "General Skills", items: [trimmedLine.substring(2).trim()] };
           if (!skillCategories.find(sc => sc.category === currentCategory?.category)) {
             skillCategories.push(currentCategory);
           }
        }
      } else if (trimmedLine.endsWith(':')) {
        const categoryName = trimmedLine.slice(0, -1);
        if (currentCategory && (currentCategory.items.length > 0 || !skillCategories.find(sc => sc.category === currentCategory?.category))) {
          if(!skillCategories.find(sc => sc.category === currentCategory?.category)) skillCategories.push(currentCategory);
        }
        currentCategory = { category: categoryName, items: [] };
        skillCategories.push(currentCategory);
      } else if (trimmedLine && currentCategory && !trimmedLine.endsWith(':')) {
         currentCategory.items.push(trimmedLine);
      } else if (trimmedLine && !currentCategory) {
         currentCategory = { category: trimmedLine, items: [] };
         skillCategories.push(currentCategory);
      }
    });
    if (currentCategory && currentCategory.items.length === 0 && skillCategories.find(sc => sc.category === currentCategory?.category && sc.items.length > 0)) {
      // Category already added with items, likely an empty category header was processed later
    } else if (currentCategory && (currentCategory.items.length > 0 || (currentCategory.category && !skillCategories.find(sc => sc.category === currentCategory?.category)))) {
        if(!skillCategories.find(sc => sc.category === currentCategory?.category)) {
           skillCategories.push(currentCategory);
        } else if (skillCategories.find(sc => sc.category === currentCategory?.category && sc.items.length === 0) && currentCategory.items.length > 0){
            const existingCat = skillCategories.find(sc => sc.category === currentCategory?.category);
            if(existingCat) existingCat.items = currentCategory.items;
        }
    }
    return skillCategories.filter(cat => cat.category && cat.category.trim() !== '' && cat.category.toLowerCase() !== 'soft skills');
  };
  const parsedSkills = processSkills(skillsContent);

  const formatPreText = (text: string | undefined) => {
    if (!text) return null;
    const lines = text.split('\n');
    const firstLine = lines[0];

    if (firstLine.startsWith('Error:')) {
        return <p className="text-red-500">{firstLine}</p>;
    }
    return <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-100">{text}</pre>;
  };

  const renderEducation = () => {
    if (!educationContent || educationContent.startsWith('Error:')) {
      return formatPreText(educationContent);
    }
    const lines = educationContent.split('\n').map(line => line.trim()).filter(line => line);
    const contentLines = lines[0].toLowerCase() === 'edducation' ? lines.slice(1) : lines;

    if (contentLines.length < 4) {
      return <p className="text-gray-400">Education details are not formatted correctly or are incomplete in education.txt.</p>;
    }

    const collegeName = contentLines[0];
    const degree = contentLines[1];
    const timeline = contentLines[2];
    const cgpa = contentLines[3];

    return (
      <div className="space-y-3 text-base">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <p className="font-semibold text-white text-left">
            <a
              href="https://engg.dypvp.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {collegeName}
            </a>
          </p>
          <p className="text-sm text-gray-300 sm:text-right mt-1 sm:mt-0">{timeline}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <p className="text-gray-100 text-left">{degree}</p>
          <p className="text-sm text-gray-300 sm:text-right mt-1 sm:mt-0">{cgpa}</p>
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experienceContent || experienceContent.startsWith('Error:')) {
      return formatPreText(experienceContent);
    }
    const lines = experienceContent.split('\n').filter(line => line && !line.toLowerCase().startsWith('exxperience'));
    const experiences: Array<{ org: string; timeline: string; role: string; description: string[] }> = [];
    let currentExperience: { org?: string; timeline?: string; role?: string; description: string[] } | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (line.startsWith('  ') && !line.startsWith('    ')) { // Organization
        if (currentExperience) experiences.push(currentExperience as any);
        currentExperience = { org: trimmedLine, description: [] };
      } else if (line.startsWith('    ') && currentExperience) { // Details for current org
        if (!currentExperience.timeline) {
          currentExperience.timeline = trimmedLine;
        } else if (!currentExperience.role) {
          currentExperience.role = trimmedLine;
        } else {
          currentExperience.description.push(trimmedLine);
        }
      }
    }
    if (currentExperience) experiences.push(currentExperience as any); // Push the last one

    if (experiences.length === 0) {
      return <p className="text-gray-400">Experience details are not formatted correctly or are incomplete in experience.txt.</p>;
    }

    return (
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="pb-6 border-b border-white/20 last:border-b-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <div className="flex items-center mb-1 sm:mb-0">
                {/* Icon removed from here */}
                <h3 className="text-lg font-semibold text-white">{exp.org}</h3>
              </div>
              <p className="text-sm text-gray-300 sm:text-right">{exp.timeline}</p>
            </div>
            <h4 className="text-md font-medium text-gray-100 mb-2 ml-0 sm:ml-7">{exp.role}</h4>
            <ul className="list-disc list-inside space-y-1 ml-0 sm:ml-7">
              {exp.description.map((desc, i) => (
                <li key={i} className="text-gray-200 text-sm leading-relaxed">{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderAchievements = () => {
    if (!achievementsContent || achievementsContent.startsWith('Error:')) {
      return formatPreText(achievementsContent);
    }
    const lines = achievementsContent.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.toLowerCase().startsWith('acchievements'));

    if (lines.length === 0) {
      return <p className="text-gray-400">No achievements listed or content is improperly formatted in achievements.txt.</p>;
    }

    return (
      <ul className="list-disc list-inside space-y-2 text-base text-gray-100 leading-relaxed">
        {lines.map((line, index) => (
          <li key={index}>
            {line.startsWith('- ') ? line.substring(2) : line}
          </li>
        ))}
      </ul>
    );
  };

  const asrPortfolioProject: ParsedProject = {
    id: "asr-portfolio-website",
    domain: "ASRWorkspace Portfolio (This Website)",
    description: "Designed and developed an interactive terminal-based portfolio with a GUI mode.",
    techStack: ["Next.js", "React", "TypeScript", "ShadCN UI", "Tailwind CSS"],
    githubLink: "https://github.com/Geek-ASR/ASRWorkspace-Portfolio",
    websiteLink: "/",
    galleryPaths: ["/screenshots/portfolio/ss1.png", "/screenshots/portfolio/ss2.png"],
  };

  const footerContactDetails = parseFooterContacts(contactsContent);


  return (
    <div className="min-h-screen text-white font-sans relative">
      <MountainParallaxBackground />
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative p-4">
        <div className="absolute top-6 right-6 z-10">
          <Link href="/" passHref legacyBehavior>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 border-black text-black hover:bg-gray-100 shadow-md"
              aria-label="Back to Terminal"
            >
              <TerminalSquare className="h-6 w-6" />
            </Button>
          </Link>
        </div>

        <div className="relative z-[5] flex flex-col md:flex-row items-center md:justify-between gap-8 lg:gap-12 w-full max-w-4xl">
          <div className="text-center md:text-left">
            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl text-white">
              <div>
                {line1Text.split("").map((char, index) => (
                  <span
                    key={`line1-${index}`}
                    className="inline-block animate-color-text-wave"
                    style={{ animationDelay: `${index * 0.07}s` }}
                    aria-hidden="true"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
              <div>
                {line2Text.split("").map((char, index) => (
                  <span
                    key={`line2-${index}`}
                    className="inline-block animate-color-text-wave font-extrabold"
                    style={{
                      animationDelay: `${(line1Text.length + index + 1) * 0.07}s`,
                    }}
                    aria-hidden="true"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
              <span className="sr-only">{`${line1Text} ${line2Text}`}</span>
            </h1>
            <div className="mt-4 min-h-[2.5rem] md:min-h-[3rem]">
              {startSubtitleAnimation && (
                <TypingEffect
                  text={subtitleText}
                  speed={50}
                  className="font-sans text-sm md:text-base lg:text-lg text-gray-200 tracking-wide block"
                />
              )}
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxhYnN0cmFjdCUyMGFydCUyMGJyb3duJTIwY29sb3J8ZW58MHx8fHwxNzQ5MTM1MTYzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Aditya Rekhe"
              width={200}
              height={200}
              className="shadow-lg object-cover"
              data-ai-hint="profile photo"
              priority
            />
          </div>
        </div>
      </section>

      {/* About Me Section */}
      {aboutMeContent && !aboutMeContent.startsWith('Error:') && (
        <section className="py-16 md:py-24 relative z-[1]"> {/* Ensure cards are above background but below fixed elements if any */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card ref={aboutMeRef} className="shadow-2xl rounded-2xl overflow-hidden border border-white/20 backdrop-blur-sm bg-card/75">
              <div className="p-8 sm:p-10 md:p-12">
                <div className="flex items-center mb-6">
                  {/* User Icon Removed from title, kept standalone if needed, but request was to remove from section titles */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">
                    About Me
                  </h2>
                </div>
                <ul className="list-disc list-inside space-y-3 text-base leading-relaxed text-gray-100">
                  <li>A <strong>quick learner</strong>, eager to explore new <strong>technologies</strong> and <strong>environments</strong>.</li>
                  <li>Passionate for <strong>innovative solutions</strong> and <strong>programming</strong>.</li>
                  <li>Embraces <strong>challenges</strong> as opportunities for <strong>growth</strong>, constantly seeking to expand <strong>skill set</strong>.</li>
                  <li>Ready to contribute with an <strong>adaptable nature</strong> and <strong>enthusiasm</strong> to any project or team.</li>
                </ul>
                <div
                  className={cn(
                    "flex items-center justify-center gap-6 mt-8 transition-opacity duration-700 ease-in-out text-white",
                    showSocialIcons ? "opacity-100" : "opacity-0"
                  )}
                >
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Connect with Aditya Rekhe on ${link.name}`}
                      className="hover:text-gray-300 transition-colors"
                    >
                      <link.icon size={28} />
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      <main className="px-6 md:px-10 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 relative z-[1]">
        {educationContent && (
          <SectionCard title="Education" icon={<BookOpen size={28} />} className="md:col-span-2">
            {renderEducation()}
          </SectionCard>
        )}

        {skillsContent && parsedSkills.length > 0 && (
          <SectionCard title="Skills" icon={<Wrench size={28} />} className="md:col-span-2">
            <div className="space-y-8">
              {parsedSkills.map((cat, idx) => (
                <div key={idx} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-white mb-4 text-xl">{cat.category}</h3>
                  {cat.items.length > 0 ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {cat.items.map(item => {
                        const skillInfo = getSkillInfo(item);
                        return (
                          <TooltipProvider key={item} delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex flex-col items-center justify-start p-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg shadow-sm w-28 h-28 text-center hover:shadow-md transition-shadow cursor-default">
                                  {skillInfo.logoPath ? (
                                    <Image
                                      src={skillInfo.logoPath}
                                      alt={`${skillInfo.name} logo`}
                                      width={48}
                                      height={48}
                                      className="object-contain mb-2"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-md mb-2">
                                      <Wrench size={24} className="text-gray-300" />
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-100 line-clamp-2">
                                    {skillInfo.name}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{skillInfo.displayName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">No specific skills listed for this category.</p>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {experienceContent && (
          <SectionCard title="Experience" icon={<Briefcase size={28} />} className="md:col-span-2">
            {renderExperience()}
          </SectionCard>
        )}

        {projectsList.length > 0 && (
          <SectionCard title="Projects" icon={<FolderGit2 size={28} />} className="md:col-span-2">
            <div className="space-y-10">
              {[
                ...projectsList.filter(p => p.name !== 'project_details.pdf').map(projectFile => (
                  parseProjectContent(projectFile.content, projectFile.name)
                )),
                asrPortfolioProject
              ].map((project, idx) => (
                <Card
                  key={project.id || idx}
                  className="shadow-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-white/30 backdrop-blur-sm bg-card/75"
                >
                  <CardHeader className="p-6 bg-black/10 border-b border-white/20">
                    <CardTitle className="text-2xl text-white font-semibold">{project.domain}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <p className="text-base leading-relaxed text-gray-100">
                      {project.description}
                    </p>

                    {project.techStack.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-white mb-2">Tech Stack:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map(tech => (
                            <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm bg-white/10 text-gray-100 border-white/20 hover:bg-white/20">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(project.githubLink || (project.websiteLink && project.websiteLink !== '#')) && (
                        <div>
                            <h4 className="text-md font-semibold text-white mb-2">Links:</h4>
                            <div className="flex flex-wrap gap-4 items-center">
                                {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-[hsl(var(--accent))] hover:underline">
                                    <Github size={18} className="mr-2" /> GitHub Repository
                                </a>
                                )}
                                {project.websiteLink && project.websiteLink !== '#' && (
                                <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-[hsl(var(--accent))] hover:underline">
                                    <ExternalLink size={18} className="mr-2" /> Live Website
                                </a>
                                )}
                            </div>
                        </div>
                    )}

                    {project.galleryPaths.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-white mb-2">Gallery:</h4>
                        <Link href={`/gui/gallery/${encodeURIComponent(project.id)}`} passHref legacyBehavior>
                          <Button className="text-sm bg-white/10 text-gray-100 border border-white/20 hover:bg-white/20 hover:text-white rounded-md shadow-sm backdrop-blur-sm">
                            <ImageIcon size={18} className="mr-2" /> View Gallery
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionCard>
        )}


        {achievementsContent && (
          <SectionCard title="Achievements" icon={<Star size={28} />} className="md:col-span-2">
             {renderAchievements()}
          </SectionCard>
        )}

      </main>

      <footer className="mt-20 pt-10 border-t border-white/20 text-center text-sm px-6 pb-6 relative z-[1] backdrop-blur-sm bg-transparent">
        {(footerContactDetails.phone || footerContactDetails.email || footerContactDetails.location) && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 mb-6 text-gray-200">
            {footerContactDetails.phone && (
              <a href={`tel:${footerContactDetails.phone}`} className="inline-flex items-center hover:text-white hover:underline">
                <Phone size={16} className="mr-2" />
                {footerContactDetails.phone}
              </a>
            )}
            {footerContactDetails.email && (
              <a href={`mailto:${footerContactDetails.email}`} className="inline-flex items-center hover:text-white hover:underline">
                <Mail size={16} className="mr-2" />
                {footerContactDetails.email}
              </a>
            )}
            {footerContactDetails.location && (
              <p className="inline-flex items-center text-gray-200">
                {/* Could add a MapPin icon here if desired */}
                {footerContactDetails.location}
              </p>
            )}
          </div>
        )}
        <p className="text-gray-300">&copy; {new Date().getFullYear()} Aditya Rekhe. All rights reserved.</p>
        <p className="mt-1 text-gray-300">Powered by ASR_Workspace</p>
      </footer>
    </div>
  );
}

