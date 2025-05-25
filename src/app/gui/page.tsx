
'use client';

import Link from 'next/link';
import { fileSystem, findNode, getRootFileContent, type Directory, type File as FileSystemFileType } from '@/lib/file-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, BookOpen, Wrench, Briefcase, Star, Mail, FolderGit2 } from 'lucide-react';
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
    // Avoid matching email if it's part of a URL (e.g., mailto: in href)
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
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, className }) => (
  <Card className={cn("shadow-lg backdrop-blur-sm bg-card/90", className)}>
    <CardHeader>
      <CardTitle className="flex items-center text-2xl text-card-foreground">
        {icon && <span className="mr-3 text-[hsl(var(--accent))]">{icon}</span>}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-muted-foreground text-base leading-relaxed">
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
           // Orphaned item, create a default category or ignore
           // For now, let's create a category if one doesn't exist
           currentCategory = { category: "General", items: [trimmedLine.substring(2).trim()] };
        }
      } else if (trimmedLine.endsWith(':')) {
        if (currentCategory) {
          skillCategories.push(currentCategory);
        }
        currentCategory = { category: trimmedLine.slice(0, -1), items: [] };
      } else if (trimmedLine) { // A category without ':' but not an item
         if (currentCategory) {
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
    return <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">{text}</pre>;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
      <header className="mb-10 pb-4 border-b border-border flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--primary))]">
          ASR_Workspace - Portfolio
        </h1>
        <Link href="/" passHref legacyBehavior>
          <Button variant="outline" size="lg" className="shadow-md text-sm">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Terminal
          </Button>
        </Link>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {aboutMe && (
          <SectionCard title="About Me" icon={<User size={28} />} className="md:col-span-2">
            <p className="text-base leading-relaxed">{aboutMe}</p>
          </SectionCard>
        )}

        {education && (
          <SectionCard title="Education" icon={<BookOpen size={28} />}>
            {formatPreText(education)}
          </SectionCard>
        )}

        {skillsContent && parsedSkills.length > 0 && (
          <SectionCard title="Skills" icon={<Wrench size={28} />}>
            <div className="space-y-4">
              {parsedSkills.map((cat, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-card-foreground mb-2 text-lg">{cat.category}</h3>
                  {cat.items.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(item => <Badge key={item} variant="secondary" className="text-sm px-3 py-1">{item}</Badge>)}
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground/80">Details for this category are general or not itemized.</p>
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
            <div className="space-y-6">
              {projectsList.map(project => (
                project.content && project.name !== 'project_details.pdf' && (
                  <Card key={project.name} className="bg-card/70 shadow-md border-border/50">
                    <CardHeader>
                      <CardTitle className="text-xl text-card-foreground">{project.name.replace(/_/g, ' ').replace('.txt', '')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {/* Display full content, assuming first line is relevant or handled by user */}
                        {project.content}
                      </p>
                    </CardContent>
                  </Card>
                )
              ))}
              <Card className="bg-card/70 shadow-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">ASRWorkspace Portfolio (This Website)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">Designed and developed an interactive terminal-based portfolio with a GUI mode.
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
            <div className="space-y-1">
              {contacts?.split('\n').map((line, index) => (
                <div key={index} className="text-base leading-relaxed">
                  <GuiContactLinkParser line={line} />
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </main>

      <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Aditya Rekhe. All rights reserved.</p>
        <p className="mt-1">Powered by ASR_Workspace</p>
      </footer>
    </div>
  );
}

    