
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { fileSystem, findNode, getRootFileContent, type Directory, type File as FileSystemFileType } from '@/lib/file-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TerminalSquare, User, BookOpen, Wrench, Briefcase, Star, Mail, FolderGit2, Github, Linkedin, FileCode2, Instagram, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import TypingEffect from '@/components/terminal/TypingEffect';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, className, cardRef }) => (
  <Card ref={cardRef} className={cn("shadow-lg bg-white rounded-lg", className)}>
    <CardHeader className="p-6">
      <CardTitle className="flex items-center text-2xl text-black font-semibold">
        {icon && <span className="mr-3 text-[hsl(var(--accent))]">{icon}</span>}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-gray-700 text-base leading-relaxed p-6 pt-0">
      {children}
    </CardContent>
  </Card>
);

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
    url: '#', // Replace with your Instagram URL
  },
];

interface SkillInfo {
  name: string; // Core skill name for display below logo
  logoPath?: string;
  displayName: string; // Full original skill text for tooltip
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
    'cplusplus': 'cplusplus.svg',
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
  };

  const logoFileName = logoMap[normalizedCoreSkill];

  return {
    name: coreSkill,
    logoPath: logoFileName ? `/logos/${logoFileName}` : undefined,
    displayName: originalText,
  };
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
    const animationStaggerDelayMs = 0.07 * 1000; // 70ms
    // Trigger when the color wave starts on the first letter of "Aditya"
    const timeForAdityaToStartWave = (line1Text.length + 1 + "A".length - "".length) * animationStaggerDelayMs;

    const timer = setTimeout(() => {
      setStartSubtitleAnimation(true);
    }, timeForAdityaToStartWave);

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
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const currentRef = aboutMeRef.current; // Capture ref value
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Clean up using captured value
      }
      observer.disconnect(); // Disconnect observer
    };
  }, []); // Empty dependency array, runs once

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
           // This case handles skills listed without a category first
           currentCategory = { category: "General Skills", items: [trimmedLine.substring(2).trim()] };
           if (!skillCategories.find(sc => sc.category === currentCategory?.category)) {
             skillCategories.push(currentCategory);
           }
        }
      } else if (trimmedLine.endsWith(':')) {
        const categoryName = trimmedLine.slice(0, -1);
        // If previous category had items or was a new "General Skills" category, ensure it's pushed
        if (currentCategory && (currentCategory.items.length > 0 || !skillCategories.find(sc => sc.category === currentCategory?.category))) {
          if(!skillCategories.find(sc => sc.category === currentCategory?.category)) skillCategories.push(currentCategory);
        }
        currentCategory = { category: categoryName, items: [] };
        skillCategories.push(currentCategory);
      } else if (trimmedLine && currentCategory && !trimmedLine.endsWith(':')) {
         // This is a skill item belonging to the current category
         currentCategory.items.push(trimmedLine);
      } else if (trimmedLine && !currentCategory) {
         // This is likely a category name without a colon, or a single skill if no categories defined yet
         currentCategory = { category: trimmedLine, items: [] };
         skillCategories.push(currentCategory);
      }
    });
    // After loop, push the last category if it has items or is a new category name
    if (currentCategory && currentCategory.items.length === 0 && skillCategories.find(sc => sc.category === currentCategory?.category && sc.items.length > 0)) {
      // If category exists with items, don't add an empty one
    } else if (currentCategory && (currentCategory.items.length > 0 || (currentCategory.category && !skillCategories.find(sc => sc.category === currentCategory?.category)))) {
        if(!skillCategories.find(sc => sc.category === currentCategory?.category)) {
           skillCategories.push(currentCategory);
        } else if (skillCategories.find(sc => sc.category === currentCategory?.category && sc.items.length === 0) && currentCategory.items.length > 0){
            // Update existing empty category with items
            const existingCat = skillCategories.find(sc => sc.category === currentCategory?.category);
            if(existingCat) existingCat.items = currentCategory.items;
        }
    }
    return skillCategories.filter(cat => cat.category && cat.category.trim() !== ''); // Filter out categories with no name
  };
  const parsedSkills = processSkills(skillsContent);
  const filteredSkills = parsedSkills.filter(cat => cat.category.toLowerCase() !== 'soft skills');


  const formatPreText = (text: string | undefined) => {
    if (!text) return null;
    const lines = text.split('\n');
    const firstLine = lines[0];

    // Check if the first line indicates an error (from getRootFileContent)
    if (firstLine.startsWith('Error:')) {
        return <p className="text-red-500">{firstLine}</p>;
    }
    // Otherwise, render the full text respecting its original formatting
    return <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-700">{text}</pre>;
  };

  const renderEducation = () => {
    if (!educationContent || educationContent.startsWith('Error:')) {
      return formatPreText(educationContent);
    }
    // Split by newline, trim, and filter out empty lines
    const lines = educationContent.split('\n').map(line => line.trim()).filter(line => line);
    // Remove the "Edducation" heading if present (case-insensitive)
    const contentLines = lines[0].toLowerCase() === 'edducation' ? lines.slice(1) : lines;

    if (contentLines.length < 4) {
      return <p className="text-gray-500">Education details are not formatted correctly or are incomplete in education.txt.</p>;
    }

    const collegeName = contentLines[0];
    const degree = contentLines[1];
    const timeline = contentLines[2];
    const cgpa = contentLines[3];

    return (
      <div className="space-y-3 text-base">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <p className="font-semibold text-black text-left">
            <a
              href="https://engg.dypvp.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {collegeName}
            </a>
          </p>
          <p className="text-sm text-gray-600 sm:text-right mt-1 sm:mt-0">{timeline}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <p className="text-gray-800 text-left">{degree}</p>
          <p className="text-sm text-gray-600 sm:text-right mt-1 sm:mt-0">{cgpa}</p>
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experienceContent || experienceContent.startsWith('Error:')) {
      return formatPreText(experienceContent);
    }
    const lines = experienceContent.split('\n').filter(line => line && !line.toLowerCase().startsWith('exxperience')); // Remove empty lines and header
    const experiences: Array<{ org: string; timeline: string; role: string; description: string[] }> = [];
    let currentExperience: { org?: string; timeline?: string; role?: string; description: string[] } | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (line.startsWith('  ') && !line.startsWith('    ')) { // Organization (indented by 2 spaces)
        if (currentExperience) experiences.push(currentExperience as any); // Push previous if exists
        currentExperience = { org: trimmedLine, description: [] };
      } else if (line.startsWith('    ') && currentExperience) { // Timeline, Role, or Description (indented by 4 spaces)
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
      return <p className="text-gray-500">Experience details are not formatted correctly or are incomplete in experience.txt.</p>;
    }

    return (
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="pb-6 border-b border-gray-200 last:border-b-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <div className="flex items-center mb-1 sm:mb-0">
                <Briefcase size={20} className="mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold text-black">{exp.org}</h3>
              </div>
              <p className="text-sm text-gray-500 sm:text-right">{exp.timeline}</p>
            </div>
            <h4 className="text-md font-medium text-gray-800 mb-2 ml-0 sm:ml-7">{exp.role}</h4>
            <ul className="list-disc list-inside space-y-1 ml-0 sm:ml-7">
              {exp.description.map((desc, i) => (
                <li key={i} className="text-gray-700 text-sm leading-relaxed">{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative p-4">
        <div className="absolute top-6 right-6 z-10">
          <Link href="/" passHref legacyBehavior>
            <Button
              variant="outline"
              size="icon"
              className="bg-white border-black text-black hover:bg-gray-100 shadow-md"
              aria-label="Back to Terminal"
            >
              <TerminalSquare className="h-6 w-6" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 lg:gap-12 w-full max-w-4xl">
          <div className="text-center md:text-left">
            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl text-black">
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
            {startSubtitleAnimation && (
              <div className="mt-4">
                <TypingEffect
                  text={subtitleText}
                  speed={50}
                  className="font-sans text-sm md:text-base lg:text-lg text-[#006400] tracking-wide block"
                />
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-0 flex-shrink-0">
            <Image
              src="/profile.png" // Assumes profile.png is in /public
              alt="Aditya Rekhe"
              width={200}
              height={200}
              className="shadow-lg object-cover" // removed rounded-full
              data-ai-hint="profile photo"
              priority // Good for LCP in hero
            />
          </div>
        </div>
      </section>

      {/* About Me Section */}
      {aboutMeContent && !aboutMeContent.startsWith('Error:') && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card ref={aboutMeRef} className="bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-8 sm:p-10 md:p-12">
                <div className="flex items-center mb-6">
                  <User size={36} className="mr-4 text-[hsl(var(--accent))]" />
                  <h2 className="text-3xl sm:text-4xl font-bold text-black">
                    About Me
                  </h2>
                </div>
                <ul className="list-disc list-inside space-y-3 text-base leading-relaxed text-gray-700">
                  <li>A <strong>quick learner</strong>, eager to explore new <strong>technologies</strong> and <strong>environments</strong>.</li>
                  <li>Passionate for <strong>innovative solutions</strong> and <strong>programming</strong>.</li>
                  <li>Embraces <strong>challenges</strong> as opportunities for <strong>growth</strong>, constantly seeking to expand <strong>skill set</strong>.</li>
                  <li>Ready to contribute with an <strong>adaptable nature</strong> and <strong>enthusiasm</strong> to any project or team.</li>
                </ul>
                <div
                  className={cn(
                    "flex items-center justify-center gap-6 mt-8 transition-opacity duration-700 ease-in-out",
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
                      className="text-gray-500 hover:text-black transition-colors"
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

      <main className="px-6 md:px-10 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {educationContent && (
          <SectionCard title="Education" icon={<BookOpen size={28} />} className="md:col-span-2">
            {renderEducation()}
          </SectionCard>
        )}

        {skillsContent && filteredSkills.length > 0 && (
          <SectionCard title="Skills" icon={<Wrench size={28} />} className="md:col-span-2">
            <div className="space-y-8">
              {filteredSkills.map((cat, idx) => (
                <div key={idx} className="bg-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-black mb-4 text-xl">{cat.category}</h3>
                  {cat.items.length > 0 ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {cat.items.map(item => {
                        const skillInfo = getSkillInfo(item);
                        return (
                          <TooltipProvider key={item} delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex flex-col items-center justify-start p-3 bg-white rounded-lg shadow-sm w-28 h-28 text-center hover:shadow-md transition-shadow cursor-default">
                                  {skillInfo.logoPath ? (
                                    <Image
                                      src={skillInfo.logoPath}
                                      alt={`${skillInfo.name} logo`}
                                      width={48}
                                      height={48}
                                      className="object-contain mb-2"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-md mb-2">
                                      <Wrench size={24} className="text-gray-500" />
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-700 line-clamp-2">
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
                    <p className="text-sm italic text-gray-500">No specific skills listed for this category.</p>
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
            <div className="space-y-8">
              {projectsList.map(project => (
                project.content && project.name !== 'project_details.pdf' && (
                  <Card 
                    key={project.name} 
                    className="bg-white shadow-md border border-gray-200 rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:border-gray-300"
                  >
                    <CardHeader className="p-5">
                      <CardTitle className="text-xl text-black font-semibold">{project.name.replace(/_/g, ' ').replace('.txt', '')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                        {project.content}
                      </p>
                    </CardContent>
                  </Card>
                )
              ))}
              <Card className="bg-white shadow-md border border-gray-200 rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:border-gray-300">
                <CardHeader className="p-5">
                  <CardTitle className="text-xl text-black font-semibold">ASRWorkspace Portfolio (This Website)</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">Designed and developed an interactive terminal-based portfolio with a GUI mode.
Tech: Next.js, React, TypeScript, ShadCN UI, Tailwind CSS.</p>
                </CardContent>
              </Card>
            </div>
          </SectionCard>
        )}

        {achievementsContent && (
          <SectionCard title="Achievements" icon={<Star size={28} />}>
             {formatPreText(achievementsContent)}
          </SectionCard>
        )}

        {contactsContent && (
          <SectionCard title="Contact" icon={<Mail size={28} />}>
            <div className="space-y-2 text-gray-700">
              {contactsContent?.split('\n').map((line, index) => (
                <div key={index} className="text-base leading-relaxed">
                  <GuiContactLinkParser line={line} />
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </main>

      <footer className="mt-20 pt-10 border-t border-gray-200 text-center text-sm text-gray-500 px-6 pb-6">
        <p>&copy; {new Date().getFullYear()} Aditya Rekhe. All rights reserved.</p>
        <p className="mt-1">Powered by ASR_Workspace</p>
      </footer>
    </div>
  );
}

    

    