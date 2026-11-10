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
} from '@/lib/portfolio-data';

export interface File {
  type: 'file';
  name: string;
  content?: string; // For text files
  url?: string; // For PDFs or other downloadable files
  mimeType?: string; // e.g., 'application/pdf'
}

export interface Directory {
  type: 'directory';
  name: string;
  children: (File | Directory)[];
}

export type FileSystemNode = File | Directory;

/* -------------------------------------------------------------------------- */
/* Text renderers: the terminal files are generated from portfolio-data.ts.   */
/* Lines are never hard-wrapped; the terminal wraps them with a hanging       */
/* indent, so they read well on both wide and narrow (mobile) screens.        */
/* -------------------------------------------------------------------------- */

export const welcomeMessage = `Welcome to ${profile.workspace}
This is my portfolio website
Type 'help' for a list of commands.
If you are more comfortable with GUI, then switch to GUI by typing cmd : 'gui' (or just scroll down)
Tip: every command you see is clickable - click or tap one to run it.`;

const educationText = (): string =>
  [
    'Education',
    ...education.flatMap((e) => [
      '',
      `  ${e.institution}`,
      ...(e.affiliation ? [`    ${e.affiliation}`] : []),
      `    ${e.degree}`,
      `    ${e.period}`,
      `    ${e.score}`,
      ...(e.notes ?? []).map((n) => `    - ${n}`),
    ]),
  ].join('\n');

const experienceText = (): string =>
  [
    'Experience',
    ...experience.flatMap((x) => [
      '',
      `  ${x.org}${x.location ? `, ${x.location}` : ''}`,
      `    ${x.period}`,
      `    ${x.role}`,
      ...x.points.map((p) => `    - ${p}`),
    ]),
  ].join('\n');

const achievementsText = (): string =>
  ['Achievements', ...achievements.map((a) => `  - ${a}`)].join('\n');

const skillsText = (): string =>
  ['SKILLS', ...skills.flatMap((g) => [`${g.category}:`, ...g.items.map((i) => `  - ${i}`)])].join('\n');

const researchText = (): string =>
  [
    'Research',
    ...research.flatMap((r) => [
      '',
      `  ${r.title}`,
      `    ${r.authors} (${r.affiliation})`,
      `    ${r.venue}, ${r.year} - ${r.status}`,
      '',
      `    Abstract: ${r.abstract}`,
      '',
      '    Key points:',
      ...r.findings.map((f) => `    - ${f}`),
      '',
      `    Keywords: ${r.keywords.join(', ')}`,
      `    Paper + dataset: ${r.doiUrl}`,
      `    Software: ${r.softwareDoiUrl}`,
      `    Code: ${r.codeUrl}`,
      `    License: ${r.license}`,
    ]),
  ].join('\n');

const certificationsText = (): string =>
  [
    'Certifications',
    ...certifications.flatMap((c) => [
      '',
      `  ${c.title}`,
      `    ${c.issuer} · ${c.date} · ${c.type}`,
      `    ${c.description}`,
    ]),
  ].join('\n');

const contactsText = (): string =>
  [
    'Contact Info:',
    `${profile.phone} · ${profile.email}`,
    ...socials.map((s) => `${s.name}: ${s.url}`),
    `Location: ${profile.location}`,
  ].join('\n');

export const projectText = (p: Project): string =>
  [
    `Name: ${p.name}`,
    `Domain: ${p.domain}`,
    `Period: ${p.period}`,
    ...(p.team ? [`Team: ${p.team}`] : []),
    `Description: ${p.description}`,
    ...(p.highlights?.length ? ['Highlights:', ...p.highlights.map((h) => `  - ${h}`)] : []),
    `${p.tagLabel ?? 'Tech Stack'}: ${p.tech.join(', ')}`,
    ...(p.github ? [`GitHub: ${p.github}`] : []),
    ...(p.website ? [`Website: ${p.website}`] : []),
    ...(p.paper ? [`Paper: ${p.paper}`] : []),
  ].join('\n');

const resumeText = (): string =>
  [
    profile.fullName,
    `${profile.phone} · ${profile.email}`,
    ...socials.map((s) => `${s.name}: ${s.url}`),
    `Location: ${profile.location}`,
    '',
    educationText(),
    '',
    experienceText(),
    '',
    skillsText(),
    '',
    'PROJECTS',
    ...projects.flatMap((p) => [
      `  ${p.name} - ${p.domain}`,
      `    - ${p.description}`,
      `    - ${p.tagLabel ?? 'Tech'}: ${p.tech.join(', ')}`,
    ]),
    '',
    researchText(),
    '',
    certificationsText(),
    '',
    achievementsText(),
  ].join('\n');

export const fileSystem: Directory = {
  type: 'directory',
  name: '~',
  children: [
    { type: 'file', name: 'README.md', content: welcomeMessage },
    { type: 'file', name: 'about_me.txt', content: `${profile.summary}\n\n${profile.now}` },
    { type: 'file', name: 'education.txt', content: educationText() },
    { type: 'file', name: 'experience.txt', content: experienceText() },
    { type: 'file', name: 'research.txt', content: researchText() },
    { type: 'file', name: 'certifications.txt', content: certificationsText() },
    { type: 'file', name: 'achievements.txt', content: achievementsText() },
    {
      type: 'file',
      name: 'resume.pdf',
      url: withBase(profile.resumeFile),
      mimeType: 'application/pdf',
    },
    { type: 'file', name: 'resume.txt', content: resumeText() },
    {
      type: 'directory',
      name: 'projects',
      children: projects.map((p) => ({ type: 'file' as const, name: p.file, content: projectText(p) })),
    },
    { type: 'file', name: 'skills.txt', content: skillsText() },
    { type: 'file', name: 'contacts.txt', content: contactsText() },
  ],
};

export function findNode(path: string, root: Directory = fileSystem): FileSystemNode | undefined {
  if (path === '/' || path === '~' || path === '') {
    return root;
  }

  const normalizedPath = path.startsWith('~/') ? path.substring(2) : path.startsWith('/') ? path.substring(1) : path.startsWith('./') ? path.substring(2) : path;
  const parts = normalizedPath.split('/').filter(p => p !== '');

  let currentNode: FileSystemNode = root;

  for (const part of parts) {
    if (currentNode.type === 'directory') {
      const found: FileSystemNode | undefined = currentNode.children.find(child => child.name === part);
      if (found) {
        currentNode = found;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  return currentNode;
}

/**
 * Resolve a path typed in the terminal ("projects", "../x", "~/x", "/x")
 * against the current directory into a normalized "~/..." path.
 */
export function resolvePath(input: string, currentPath: string): string {
  const absolute = input === '~' || input.startsWith('~/') || input.startsWith('/');
  const base = absolute ? [] : currentPath.split('/').filter((p) => p && p !== '~');
  const rest = input.replace(/^~/, '').split('/');
  for (const part of rest) {
    if (!part || part === '.') continue;
    if (part === '..') base.pop();
    else base.push(part);
  }
  return base.length ? `~/${base.join('/')}` : '~';
}

export function getRootFileContent(fileName: string): string | undefined {
  const node = findNode(`~/${fileName}`);
  if (node && node.type === 'file' && node.content) {
    return node.content;
  }
  if (node && node.type === 'file' && !node.content) {
    return `Error: ${fileName} is not a text file or is empty.`;
  }
  return `Error: File '${fileName}' not found.`;
}
