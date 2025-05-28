
'use client';

import type { ParsedProject } from '@/app/gui/page'; // Assuming ParsedProject is exported
import { fileSystem, findNode, type FileSystemNode } from '@/lib/file-system';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

// Simplified parser for this page, or ideally import from gui/page.tsx
function parseProjectContentForGallery(content: string | undefined, projectId: string): ParsedProject {
  const project: ParsedProject = {
    id: projectId,
    domain: 'Untitled Project',
    description: '', // Not strictly needed for gallery page
    techStack: [], // Not strictly needed
    galleryPaths: [],
  };
  if (!content) return project;

  const lines = content.split('\n');
  let currentKey: 'galleryPaths' | null = null;

  for (const line of lines) {
    const domainMatch = line.match(/^Domain:\s*(.*)/i);
    const galleryHeaderMatch = line.match(/^Gallery:/i);
    const galleryItemMatch = line.match(/^\s*-\s*(.*)/);

    if (domainMatch) {
      project.domain = domainMatch[1].trim();
      currentKey = null;
    } else if (galleryHeaderMatch) {
      currentKey = 'galleryPaths';
    } else if (galleryItemMatch && currentKey === 'galleryPaths') {
      project.galleryPaths.push(galleryItemMatch[1].trim());
    }
  }
  return project;
}

export default function ProjectGalleryPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ParsedProject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decodedProjectId = decodeURIComponent(params.projectId);

  useEffect(() => {
    if (!decodedProjectId) {
      setError("Project ID is missing.");
      return;
    }

    let projectNode: FileSystemNode | undefined;
    let projectContent: string | undefined;
    let parsed: ParsedProject;

    if (decodedProjectId === "asr-portfolio-website") {
      // Handle the hardcoded portfolio project
      parsed = {
        id: "asr-portfolio-website",
        domain: "ASRWorkspace Portfolio (This Website)",
        description: "",
        techStack: [],
        galleryPaths: ["/screenshots/portfolio/ss1.png", "/screenshots/portfolio/ss2.png"],
      };
    } else {
      projectNode = findNode(`~/projects/${decodedProjectId}`);
      if (!projectNode || projectNode.type !== 'file') {
        setError(`Project not found: ${decodedProjectId}`);
        return;
      }
      projectContent = projectNode.content;
      if (!projectContent) {
        setError(`No content found for project: ${decodedProjectId}`);
        return;
      }
      parsed = parseProjectContentForGallery(projectContent, decodedProjectId);
    }

    setProject(parsed);
  }, [decodedProjectId]);

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="mb-6">{error}</p>
        <Link href="/gui" passHref legacyBehavior>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center justify-center">
        <p>Loading project gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-black">{project.domain} - Gallery</h1>
        <Link href="/gui" passHref legacyBehavior>
          <Button variant="outline" size="icon" className="bg-white border-black text-black hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Portfolio</span>
          </Button>
        </Link>
      </header>

      {project.galleryPaths.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {project.galleryPaths.map((path, imgIdx) => (
            <Card key={imgIdx} className="overflow-hidden shadow-lg rounded-lg">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100">
                  <Image
                    src={`https://placehold.co/600x400.png`} // Using a larger placeholder
                    alt={`${project.domain} screenshot ${imgIdx + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    data-ai-hint={`${project.domain.toLowerCase().replace(/\s+/g, '-').substring(0, 20)} screenshot`} // Ensure hint is concise
                  />
                </div>
              </CardContent>
              {/* You could add a CardFooter for captions if needed */}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No images available for this project's gallery.</p>
      )}
        <p className="text-xs text-gray-500 mt-4">
            Note: Screenshots are placeholders. Replace with actual images in your <code>public</code> folder, e.g., <code>public{project.galleryPaths[0] || '/screenshots/project/image.png'}</code>
        </p>
    </div>
  );
}

    