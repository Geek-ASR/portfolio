
'use client';

import Link from 'next/link';
import { fileSystem, findNode, getRootFileContent, type Directory, type File as FileSystemFileType } from '@/lib/file-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TerminalSquare, User, BookOpen, Wrench, Briefcase, Star, Mail, FolderGit2 } from 'lucide-react'; // Changed ArrowLeft to TerminalSquare
import React from 'react';
import { cn } from '@/lib/utils';

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
    if (!matches.some(m => m.index <= match.index && (m.index + m.length) >= (match.index + m.length) && m.type === 'url')) {
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
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, className }) => (
  <Card className={cn("shadow-lg bg-white border border-gray-200 rounded-lg", className)}>
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


export default function GuiPage() {
  const aboutMe = getRootFileContent('about_me.txt');
  const education = getRootFileContent('education.txt');
  const skillsContent = getRootFileContent('skills.txt');
  const experience = getRootFileContent('experience.txt');
  const achievements = getRootFileContent('achievements.txt');
  const contacts = getRootFileContent('contacts.txt');

  const projectsNode = findNode('~/projects');
  const projectsList = projectsNode && projectsNode.type === 'directory' ? projectsNode.children.filter(c => c.type === 'file') as FileSystemFileType[] : [];

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
           currentCategory = { category: "General", items: [trimmedLine.substring(2).trim()] };
        }
      } else if (trimmedLine.endsWith(':')) {
        if (currentCategory && (currentCategory.items.length > 0 || !skillCategories.find(sc => sc.category === currentCategory?.category))) {
          skillCategories.push(currentCategory);
        }
        currentCategory = { category: trimmedLine.slice(0, -1), items: [] };
      } else if (trimmedLine) { 
         if (currentCategory && (currentCategory.items.length > 0 || !skillCategories.find(sc => sc.category === currentCategory?.category))) {
          skillCategories.push(currentCategory);
        }
        currentCategory = { category: trimmedLine, items: [] };
      }
    });
    if (currentCategory && (currentCategory.items.length > 0 || (currentCategory.category && !skillCategories.find(sc => sc.category === currentCategory?.category)))) {
      skillCategories.push(currentCategory);
    }
    return skillCategories.filter(cat => cat.category && cat.category.trim() !== '');
  };
  const parsedSkills = processSkills(skillsContent);

  const formatPreText = (text: string | undefined) => {
    if (!text) return null;
    return <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-gray-700">{text}</pre>;
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans p-6 md:p-10 lg:p-12">
      <header className="mb-12 pb-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-black"> {/* Title updated and size reduced */}
          ASR_Workspace
        </h1>
        <Link href="/" passHref legacyBehavior>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white border-black text-black hover:bg-gray-100 shadow-md" // Updated button style
            aria-label="Back to Terminal"
          >
            <TerminalSquare className="h-6 w-6" /> {/* Icon changed to TerminalSquare */}
          </Button>
        </Link>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {aboutMe && (
          <SectionCard title="About Me" icon={<User size={28} />} className="md:col-span-2">
            <p className="text-base leading-relaxed text-gray-700">{aboutMe}</p>
          </SectionCard>
        )}

        {education && (
          <SectionCard title="Education" icon={<BookOpen size={28} />}>
            {formatPreText(education)}
          </SectionCard>
        )}

        {skillsContent && parsedSkills.length > 0 && (
          <SectionCard title="Skills" icon={<Wrench size={28} />}>
            <div className="space-y-6">
              {parsedSkills.map((cat, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-black mb-3 text-xl">{cat.category}</h3>
                  {cat.items.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(item => <Badge key={item} variant="outline" className="text-sm px-3 py-1 border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100">{item}</Badge>)}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-500">Details for this category are general or not itemized.</p>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {experience && (
          <SectionCard title="Experience" icon={<Briefcase size={28} />} className="md:col-span-2">
            {formatPreText(experience)}
          </SectionCard>
        )}
        
        {projectsList.length > 0 && (
          <SectionCard title="Projects" icon={<FolderGit2 size={28} />} className="md:col-span-2">
            <div className="space-y-8">
              {projectsList.map(project => (
                project.content && project.name !== 'project_details.pdf' && (
                  <Card key={project.name} className="bg-white shadow-md border border-gray-200 rounded-md">
                    <CardHeader className="p-5">
                      <CardTitle className="text-xl text-black font-medium">{project.name.replace(/_/g, ' ').replace('.txt', '')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                        {project.content}
                      </p>
                    </CardContent>
                  </Card>
                )
              ))}
              <Card className="bg-white shadow-md border border-gray-200 rounded-md">
                <CardHeader className="p-5">
                  <CardTitle className="text-xl text-black font-medium">ASRWorkspace Portfolio (This Website)</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">Designed and developed an interactive terminal-based portfolio with a GUI mode.
Tech: Next.js, React, TypeScript, ShadCN UI, Tailwind CSS.</p>
                </CardContent>
              </Card>
            </div>
          </SectionCard>
        )}

        {achievements && (
          <SectionCard title="Achievements" icon={<Star size={28} />}>
             {formatPreText(achievements)}
          </SectionCard>
        )}

        {contacts && (
          <SectionCard title="Contact" icon={<Mail size={28} />}>
            <div className="space-y-2 text-gray-700">
              {contacts?.split('\n').map((line, index) => (
                <div key={index} className="text-base leading-relaxed">
                  <GuiContactLinkParser line={line} />
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </main>

      <footer className="mt-20 pt-10 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Aditya Rekhe. All rights reserved.</p>
        <p className="mt-1">Powered by ASR_Workspace</p>
      </footer>
    </div>
  );
}
