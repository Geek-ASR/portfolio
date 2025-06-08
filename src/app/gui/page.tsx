
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { fileSystem, findNode, getRootFileContent, type Directory, type File as FileSystemFileType } from '@/lib/file-system';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TerminalSquare, User, BookOpen, Wrench, Briefcase, Star, Mail, FolderGit2, Github, Linkedin, FileCode2, Instagram, ArrowLeft, ExternalLink, Image as ImageIcon, Phone, ChevronDown, Trophy, Zap, Lightbulb, GraduationCap, Building } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import TypingEffect from '@/components/terminal/TypingEffect';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import WaveBackground from '@/components/ui/wave-background';
import { motion } from 'framer-motion';


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
        className="text-[hsl(var(--accent))] hover:underline hover:text-electricBlue transition-colors"
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
  children: React.ReactNode;
  className?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  titleClassName?: string;
}

const SectionCard: React.FC<SectionCardProps> = React.memo(({ title, children, className, cardRef, titleClassName }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
  >
    <Card
      ref={cardRef}
      className={cn(
        "shadow-xl border border-[hsl(var(--accent))]/30 backdrop-blur-md bg-card/10", 
        "transition-all duration-300",
        className
      )}
    >
      <CardHeader className="p-6">
        <CardTitle className={cn("text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue pb-2", titleClassName)}>
          {title}
        </CardTitle>
        <div className="h-0.5 w-1/4 bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue shadow-[0_0_8px_hsl(var(--accent)),_0_0_12px_hsl(var(--accent))]"></div>
      </CardHeader>
      <CardContent className="text-[hsl(var(--foreground))] text-base leading-relaxed p-6 pt-0">
        {children}
      </CardContent>
    </Card>
  </motion.div>
));
SectionCard.displayName = 'SectionCard';

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/Geek-ASR' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/aditya-rekhe-94b27122a/' },
  { name: 'GeeksforGeeks', icon: FileCode2, url: 'https://www.geeksforgeeks.org/user/adityare545t/' },
  { name: 'Instagram', icon: Instagram, url: '#' }, 
];

interface SkillInfo {
  name: string;
  logoPath?: string;
  displayName: string;
  color?: string; 
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
  const normalizedCoreSkill = coreSkill.toLowerCase().replace(/\s+/g, '').replace(/\./g, '').replace(/\+/g, 'plus').replace(/&/g, 'and');
  
  const logoMap: Record<string, string> = {
    'python': 'python.svg', 'javascript': 'javascript.svg', 'typescript': 'typescript.svg', 'java': 'java.svg', 'c++': 'cplusplus.svg', 'solidity': 'solidity.svg', 'rust': 'rust.svg', 'react': 'react.svg', 'nextjs': 'nextjs.svg', 'html5': 'html5.svg', 'css3': 'css3.svg', 'tailwindcss': 'tailwindcss.svg', 'nodejs': 'nodejs.svg', 'expressjs': 'expressjs.svg', 'graphql': 'graphql.svg', 'postgresql': 'postgresql.svg', 'mysql': 'mysql.svg', 'mongodb': 'mongodb.svg', 'git': 'git.svg', 'github': 'github.svg', 'gitlab': 'gitlab.svg', 'docker': 'docker.svg', 'kubernetes': 'kubernetes.svg', 'aws': 'aws.svg', 'firebase': 'firebase.svg', 'linux': 'linux.svg', 'ubuntu': 'ubuntu.svg', 'openzeppelin': 'openzeppelin.png', 'erc20': 'ethereum.svg', 'erc721': 'ethereum.svg', 'erc1155': 'ethereum.svg', 'hardhat': 'hardhat.svg', 'truffle': 'truffle.png', 'ganache': 'ganache.png', 'remixide': 'remix.svg', 'web3js': 'web3js.svg', 'ethersjs': 'ethers.svg', 'chainlink': 'chainlink.svg', 'ipfs': 'ipfs.svg', 'ec2': 'aws-ec2.svg', 's3': 'aws-s3.svg', 'lambda': 'aws-lambda.svg', 'macos': 'apple.svg', 'windows': 'windows.svg', 'algorithms': 'brain.svg',
  };
  const logoFileName = logoMap[normalizedCoreSkill];

  const colorMap: Record<string, string> = {
    'python': 'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
    'javascript': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    'typescript': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'react': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    'nextjs': 'bg-neutral-300/10 text-neutral-200 border-neutral-300/30',
    'solidity': 'bg-gray-400/10 text-gray-300 border-gray-400/30',
    'tailwindcss': 'bg-teal-400/10 text-teal-300 border-teal-400/30',
    'nodejs': 'bg-green-500/10 text-green-400 border-green-500/30',
  };
  return {
    name: coreSkill,
    logoPath: logoFileName ? `/logos/${logoFileName}` : undefined,
    displayName: originalText,
    color: colorMap[normalizedCoreSkill] || 'bg-slate-700/20 text-slate-300 border-slate-600/30', 
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
  const project: ParsedProject = { id: projectId, domain: 'Untitled Project', description: 'No description available.', techStack: [], galleryPaths: [] };
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
    if (domainMatch) { project.domain = domainMatch[1].trim(); currentKey = null; }
    else if (descMatch) { project.description = descMatch[1].trim(); currentKey = 'description'; }
    else if (techMatch) { project.techStack = techMatch[1].split(',').map(tech => tech.trim()).filter(tech => tech); currentKey = null; }
    else if (githubMatch) { project.githubLink = githubMatch[1].trim(); currentKey = null; }
    else if (websiteMatch) { project.websiteLink = websiteMatch[1].trim(); currentKey = null; }
    else if (galleryHeaderMatch) { currentKey = 'galleryPaths'; }
    else if (galleryItemMatch && currentKey === 'galleryPaths') { project.galleryPaths.push(galleryItemMatch[1].trim()); }
    else if (currentKey === 'description' && line.trim() !== '') {
      if (project.description === 'No description available.') project.description = line.trim();
      else project.description += `\n${line.trim()}`;
    }
  }
  project.description = project.description.trim();
  return project;
}

interface FooterContactInfo { phone?: string; email?: string; location?: string; }
function parseFooterContacts(content: string | undefined): FooterContactInfo { 
  if (!content) return {};
  const lines = content.split('\n');
  let phone: string | undefined, email: string | undefined, location: string | undefined;
  const contactDetailLine = lines.find(line => line.includes('@') && /\d{10}/.test(line.replace(/\s|·/g, '')));
  if (contactDetailLine) {
    const emailMatch = contactDetailLine.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/);
    if (emailMatch) email = emailMatch[0];
    const phoneMatch = contactDetailLine.match(/\b\d{10}\b/);
    if (phoneMatch) phone = phoneMatch[0];
  }
  const locationLine = lines.find(line => line.toLowerCase().startsWith('loc:'));
  if (locationLine) location = locationLine.substring(4).trim();
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
  const heroNameLine1 = "Hello, I am";
  const heroNameLine2 = "Aditya Rekhe";
  const heroSubtitle = "Software Engineer | Blockchain Enthusiast | Educator";

  useEffect(() => {
    const timer = setTimeout(() => setStartSubtitleAnimation(true), (heroNameLine1.length + heroNameLine2.length) * 70); 
    return () => clearTimeout(timer);
  }, [heroNameLine1.length, heroNameLine2.length]);

  const processSkills = (skillsText: string | undefined) => { 
    if (!skillsText) return [];
    const lines = skillsText.split('\n').filter(line => line.trim() !== '' && !line.trim().toUpperCase().startsWith("SKILLS"));
    const skillCategories: { category: string; items: string[] }[] = [];
    let currentCategory: { category: string; items: string[] } | null = null;
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ')) {
        if (currentCategory) currentCategory.items.push(trimmedLine.substring(2).trim());
        else {
           currentCategory = { category: "General Skills", items: [trimmedLine.substring(2).trim()] };
           if (!skillCategories.find(sc => sc.category === currentCategory?.category)) skillCategories.push(currentCategory);
        }
      } else if (trimmedLine.endsWith(':')) {
        const categoryName = trimmedLine.slice(0, -1);
        if (currentCategory && (currentCategory.items.length > 0 || !skillCategories.find(sc => sc.category === currentCategory?.category))) {
          if(!skillCategories.find(sc => sc.category === currentCategory?.category)) skillCategories.push(currentCategory);
        }
        currentCategory = { category: categoryName, items: [] };
        skillCategories.push(currentCategory);
      } else if (trimmedLine && currentCategory && !trimmedLine.endsWith(':')) currentCategory.items.push(trimmedLine);
      else if (trimmedLine && !currentCategory) {
         currentCategory = { category: trimmedLine, items: [] };
         skillCategories.push(currentCategory);
      }
    });
    if (currentCategory && currentCategory.items.length === 0 && skillCategories.find(sc => sc.category === currentCategory?.category && sc.items.length > 0)) {}
    else if (currentCategory && (currentCategory.items.length > 0 || (currentCategory.category && !skillCategories.find(sc => sc.category === currentCategory?.category)))) {
        if(!skillCategories.find(sc => sc.category === currentCategory?.category)) skillCategories.push(currentCategory);
        else if (skillCategories.find(sc => sc.category === currentCategory?.category && sc.items.length === 0) && currentCategory.items.length > 0){
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
    if (firstLine.startsWith('Error:')) return <p className="text-red-500">{firstLine}</p>;
    return <pre className="whitespace-pre-wrap font-light text-base leading-relaxed text-[hsl(var(--muted))]">{text}</pre>;
  };

  const renderEducation = () => { 
    if (!educationContent || educationContent.startsWith('Error:')) return formatPreText(educationContent);
    const lines = educationContent.split('\n').map(line => line.trim()).filter(line => line);
    const contentLines = lines[0].toLowerCase().includes('education') ? lines.slice(1) : lines; 
    if (contentLines.length < 3) return <p className="text-[hsl(var(--muted))]">Education details not formatted correctly.</p>;
    const [collegeName, degreeAndTimeline, cgpa] = contentLines;
    
    const timelineMatch = degreeAndTimeline.match(/(\s*-\s*[A-Za-z]{3,},\s*\d{4}\s*–\s*[A-Za-z]{3,},\s*\d{4})$/);
    let degree = degreeAndTimeline;
    let timeline = "";
    if (timelineMatch) {
      degree = degreeAndTimeline.replace(timelineMatch[0], "").trim();
      timeline = timelineMatch[0].replace(/^\s*-\s*/, "").trim();
    }

    return (
      <div className="space-y-3 text-base">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <p className="font-semibold text-[hsl(var(--foreground))] text-left">
            <a href="https://engg.dypvp.edu.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--accent))] transition-colors">
              {collegeName}
            </a>
          </p>
          <p className="text-sm text-[hsl(var(--muted))] sm:text-right mt-1 sm:mt-0">{timeline}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <p className="text-[hsl(var(--foreground))] text-left">{degree}</p>
          <p className="text-sm text-[hsl(var(--muted))] sm:text-right mt-1 sm:mt-0">{cgpa}</p>
        </div>
      </div>
    );
  };

  const renderExperience = () => { 
    if (!experienceContent || experienceContent.startsWith('Error:')) return formatPreText(experienceContent);
    const lines = experienceContent.split('\n').filter(line => line && !line.toLowerCase().startsWith('experience')); // Corrected filter
    const experiences: Array<{ org: string; timeline: string; role: string; description: string[] }> = [];
    let currentExperience: { org?: string; timeline?: string; role?: string; description: string[] } | null = null;
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (line.startsWith('  ') && !line.startsWith('    ')) {
        if (currentExperience) experiences.push(currentExperience as any);
        currentExperience = { org: trimmedLine, description: [] };
      } else if (line.startsWith('    ') && currentExperience) {
        if (!currentExperience.timeline) currentExperience.timeline = trimmedLine;
        else if (!currentExperience.role) currentExperience.role = trimmedLine;
        else currentExperience.description.push(trimmedLine);
      }
    }
    if (currentExperience) experiences.push(currentExperience as any);
    if (experiences.length === 0) return <p className="text-[hsl(var(--muted))]">Experience details not formatted correctly.</p>;

    return (
      <div className="relative space-y-12 before:absolute before:inset-y-0 before:ml-5 before:h-full before:w-0.5 before:bg-[hsl(var(--accent))]/30">
        {experiences.map((exp, index) => (
          <motion.div 
            key={index} 
            className="relative pl-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="absolute left-5 top-1 z-10 -ml-[5px] mt-1 flex h-3 w-3 items-center justify-center rounded-full bg-[hsl(var(--accent))] shadow-[0_0_10px_hsl(var(--accent))]"></div>
            <div className="mb-1">
              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">{exp.org}</h3>
              <p className="text-sm text-[hsl(var(--muted))]">{exp.timeline}</p>
            </div>
            <h4 className="text-lg font-medium text-[hsl(var(--primary))] mb-2">{exp.role}</h4>
            <ul className="list-disc list-inside space-y-1 ml-0">
              {exp.description.map((desc, i) => (
                <li key={i} className="text-[hsl(var(--muted))] text-sm leading-relaxed">{desc}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    );
  };


  const renderAchievements = () => { 
    if (!achievementsContent || achievementsContent.startsWith('Error:')) return formatPreText(achievementsContent);
    const lines = achievementsContent.split('\n').map(line => line.trim()).filter(line => line && !line.toLowerCase().startsWith('acchievements'));
    if (lines.length === 0) return <p className="text-[hsl(var(--muted))]">No achievements listed.</p>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lines.map((line, index) => (
           <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px hsla(var(--accent), 0.3)"}}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3 p-4 bg-white/5 border border-[hsl(var(--accent))]/20 rounded-lg shadow-md hover:shadow-lg hover:border-[hsl(var(--accent))]/40 transition-all duration-300"
          >
            <Trophy className="h-8 w-8 text-[hsl(var(--accent))] animate-pulse" />
            <span className="text-sm text-[hsl(var(--foreground))]">{line.startsWith('- ') ? line.substring(2) : line}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  const asrPortfolioProject: ParsedProject = { 
    id: "asr-portfolio-website", domain: "ASRWorkspace Portfolio (This Website)", description: "Designed and developed an interactive terminal-based portfolio with a GUI mode.", techStack: ["Next.js", "React", "TypeScript", "ShadCN UI", "Tailwind CSS"], githubLink: "https://github.com/Geek-ASR/ASRWorkspace-Portfolio", websiteLink: "/", galleryPaths: ["/screenshots/portfolio/ss1.png", "/screenshots/portfolio/ss2.png"],
  };
  const footerContactDetails = parseFooterContacts(contactsContent);

  return (
    <div className="min-h-screen text-[hsl(var(--foreground))] font-sans relative overflow-x-hidden">
      <WaveBackground />
      <header className="absolute top-6 right-6 z-20">
        <Link href="/" passHref legacyBehavior>
          <Button variant="outline" size="icon" className="bg-white/10 border-[hsl(var(--accent))]/50 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]/20 hover:text-[hsl(var(--accent))] shadow-md backdrop-blur-sm" aria-label="Back to Terminal">
            <TerminalSquare className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative p-4 text-center">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-[5] flex flex-col items-center gap-8 w-full max-w-4xl"
        >
          <div className="mb-8">
            <Image
              src="https://images.unsplash.com/photo-1656057488030-1998af700b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBhYnN0cmFjdCUyMGFydHxlbnwwfHx8fDE3NDk0MDU1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Aditya Rekhe"
              width={180}
              height={180}
              className="object-cover rounded-full shadow-2xl border-4 border-[hsl(var(--accent))] p-1 box-content"
              style={{ boxShadow: `0 0 20px hsl(var(--accent)), 0 0 35px hsl(var(--accent)), 0 0 50px hsl(var(--accent))` }}
              data-ai-hint="profile photo"
              priority
            />
          </div>
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--foreground))] to-[hsl(var(--muted))]">
            <div>
              {heroNameLine1.split("").map((char, index) => (
                <motion.span 
                  key={`line1-${index}`} 
                  className="inline-block"
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
            <div className="mt-1">
              {heroNameLine2.split("").map((char, index) => (
                 <motion.span 
                  key={`line2-${index}`} 
                  className="inline-block font-extrabold"
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ duration: 0.5, delay: 0.5 + (heroNameLine1.length + index + 1) * 0.05 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          </h1>
          <div className="mt-4 min-h-[2.5rem] md:min-h-[3rem]">
            {startSubtitleAnimation && (
              <TypingEffect
                text={heroSubtitle}
                speed={60}
                className="text-lg md:text-xl lg:text-2xl text-[hsl(var(--muted))] tracking-wide block"
              />
            )}
          </div>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-scroll-indicator-bounce">
          <ChevronDown className="h-8 w-8 text-[hsl(var(--accent))]" />
        </div>
      </section>

      {/* About Me Section */}
      {aboutMeContent && !aboutMeContent.startsWith('Error:') && (
        <section className="py-16 md:py-24 relative z-[1]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
             >
             <Card className="shadow-2xl rounded-2xl overflow-hidden border border-[hsl(var(--accent))]/30 backdrop-blur-md bg-card/10">
              <CardHeader className="p-8 sm:p-10 md:p-12">
                <CardTitle className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue pb-2">
                  About Me
                </CardTitle>
                 <div className="h-0.5 w-1/4 bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue shadow-[0_0_8px_hsl(var(--accent)),_0_0_12px_hsl(var(--accent))]"></div>
              </CardHeader>
              <CardContent className="p-8 sm:p-10 md:p-12 pt-0">
                <ul className="space-y-6 text-base leading-relaxed text-[hsl(var(--foreground))]">
                  <li className="flex items-start"><Lightbulb className="h-6 w-6 text-[hsl(var(--accent))] mr-3 mt-1 shrink-0" />A <strong>quick learner</strong>, eager to explore new <strong>technologies</strong> and <strong>environments</strong>.</li>
                  <li className="flex items-start"><Zap className="h-6 w-6 text-[hsl(var(--accent))] mr-3 mt-1 shrink-0" />Passionate for <strong>innovative solutions</strong> and <strong>programming</strong>.</li>
                  <li className="flex items-start"><GraduationCap className="h-6 w-6 text-[hsl(var(--accent))] mr-3 mt-1 shrink-0" />Embraces <strong>challenges</strong> as opportunities for <strong>growth</strong>, constantly seeking to expand <strong>skill set</strong>.</li>
                  <li className="flex items-start"><Building className="h-6 w-6 text-[hsl(var(--accent))] mr-3 mt-1 shrink-0" />Ready to contribute with an <strong>adaptable nature</strong> and <strong>enthusiasm</strong> to any project or team.</li>
                </ul>
                <div className="flex items-center justify-center gap-6 mt-10">
                  {socialLinks.map((link) => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Connect with Aditya Rekhe on ${link.name}`}
                       className="text-white hover:text-gray-300 transition-colors group">
                      <link.icon size={32} className="group-hover:animate-pulse-social" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </section>
      )}

      <main className="px-6 md:px-10 lg:px-16 py-16 grid grid-cols-1 gap-y-16 lg:gap-y-24 relative z-[1]">
        {educationContent && (
          <SectionCard title="Education">
            {renderEducation()}
          </SectionCard>
        )}

        {skillsContent && parsedSkills.length > 0 && (
          <SectionCard title="Skills">
            <div className="space-y-10">
              {parsedSkills.map((cat, idx) => (
                <div key={idx} className="bg-white/5 border border-[hsl(var(--accent))]/10 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue mb-6">{cat.category}</h3>
                  {cat.items.length > 0 ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {cat.items.map(item => {
                        const skillInfo = getSkillInfo(item);
                        return (
                          <TooltipProvider key={item} delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.div
                                  whileHover={{ scale: 1.05, boxShadow: `0px 0px 15px ${skillInfo.name === 'React' ? 'hsl(197 90% 50%)': 'hsl(var(--accent))'}` }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className={cn(
                                    "flex flex-col items-center justify-start p-4 rounded-lg shadow-md w-32 h-32 text-center cursor-default border",
                                    skillInfo.color 
                                  )}
                                >
                                  {skillInfo.logoPath ? (
                                    <Image src={skillInfo.logoPath} alt={`${skillInfo.name} logo`} width={48} height={48} className="object-contain mb-2 filter brightness-0 invert-[95%]" />
                                  ) : (
                                    <div className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-md mb-2"><Wrench size={24} className="text-gray-300" /></div>
                                  )}
                                  <span className="text-xs line-clamp-2 mt-auto pt-1">{skillInfo.name}</span>
                                </motion.div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-background border-[hsl(var(--accent))]/50 text-foreground">
                                <p>{skillInfo.displayName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  ) : <p className="text-sm italic text-[hsl(var(--muted))]">No specific skills listed.</p>}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {experienceContent && (
          <SectionCard title="Experience">
            {renderExperience()}
          </SectionCard>
        )}

        {projectsList.length > 0 && (
          <SectionCard title="Projects">
            <div className="space-y-10">
              {[...projectsList.filter(p => p.name !== 'project_details.pdf').map(projectFile => parseProjectContent(projectFile.content, projectFile.name)), asrPortfolioProject]
              .map((project, idx) => (
                <motion.div
                  key={project.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0px 10px 20px hsla(var(--accent), 0.2)" }}                  
                >
                <Card className="shadow-lg border border-[hsl(var(--accent))]/20 rounded-xl overflow-hidden bg-card/10 backdrop-blur-sm transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-[hsl(var(--accent))]/40">
                  <CardHeader className="p-6 bg-black/10 border-b border-[hsl(var(--accent))]/20">
                    <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent))] to-electricBlue font-semibold">{project.domain}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-[hsl(var(--primary))] mb-2">Description</h4>
                      <p className="text-sm text-[hsl(var(--muted))] whitespace-pre-line">{project.description}</p>
                    </div>

                    {project.techStack.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-[hsl(var(--primary))] mb-3">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map(tech => (
                            <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/30 hover:bg-[hsl(var(--accent))]/20">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(project.githubLink || (project.websiteLink && project.websiteLink !== '#') || project.galleryPaths.length > 0) && (
                      <div>
                        <h4 className="text-lg font-medium text-[hsl(var(--primary))] mb-3">Links & Gallery</h4>
                        <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-[hsl(var(--accent))] hover:text-electricBlue hover:underline">
                              <Github size={18} className="mr-2" /> GitHub Repository
                            </a>
                          )}
                          {project.websiteLink && project.websiteLink !== '#' && (
                            <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-[hsl(var(--accent))] hover:text-electricBlue hover:underline">
                              <ExternalLink size={18} className="mr-2" /> Live Website
                            </a>
                          )}
                          {project.galleryPaths.length > 0 && (
                              <Link href={`/gui/gallery/${encodeURIComponent(project.id)}`} passHref legacyBehavior>
                                <Button variant="outline" size="sm" className="text-sm bg-transparent border-[hsl(var(--accent))]/50 text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10 hover:text-electricBlue hover:border-electricBlue/70 shadow-sm backdrop-blur-sm">
                                  <ImageIcon size={16} className="mr-2" /> View Gallery
                                </Button>
                              </Link>
                            )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        )}

        {achievementsContent && (
          <SectionCard title="Achievements">
             {renderAchievements()}
          </SectionCard>
        )}
      </main>

      <footer className="mt-20 pt-10 border-t border-[hsl(var(--accent))]/20 text-center text-sm px-6 pb-6 relative z-[1] bg-black/20 backdrop-blur-sm">
        {(footerContactDetails.phone || footerContactDetails.email || footerContactDetails.location) && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 mb-6 text-[hsl(var(--muted))]">
            {footerContactDetails.phone && ( <a href={`tel:${footerContactDetails.phone}`} className="inline-flex items-center hover:text-[hsl(var(--accent))] hover:underline transition-colors"> <Phone size={16} className="mr-2" /> {footerContactDetails.phone} </a> )}
            {footerContactDetails.email && ( <a href={`mailto:${footerContactDetails.email}`} className="inline-flex items-center hover:text-[hsl(var(--accent))] hover:underline transition-colors"> <Mail size={16} className="mr-2" /> {footerContactDetails.email} </a> )}
            {footerContactDetails.location && ( <p className="inline-flex items-center"> {footerContactDetails.location} </p> )}
          </div>
        )}
        <p className="text-[hsl(var(--muted))]">&copy; {new Date().getFullYear()} Aditya Rekhe. All rights reserved.</p>
        <p className="mt-1 text-[hsl(var(--muted))]">Powered by ASR_Workspace</p>
      </footer>
    </div>
  );
}


    
