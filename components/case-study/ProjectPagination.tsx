'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS_DATA, ProjectData } from '@/data/projects'; // Adjust path to your projects file

interface ProjectPaginationProps {
  currentSlug: string;
}

export default function ProjectPagination({ currentSlug }: ProjectPaginationProps) {
  // Convert object dictionary into an ordered list
  const projectList: ProjectData[] = Object.values(PROJECTS_DATA);
  const currentIndex = projectList.findIndex((p) => p.id === currentSlug);

  if (currentIndex === -1) return null;

  const prevProject = currentIndex > 0 ? projectList[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projectList.length - 1 ? projectList[currentIndex + 1] : null;

  // Don't render anything if there's no next or previous project
  if (!prevProject && !nextProject) return null;

  return (
    <section className="w-full py-20 bg-background text-foreground">
      <div className="w-full px-6 mx-auto max-w-7xl md:px-12">
        <div
          className={`grid grid-cols-1 gap-10 md:gap-16 items-end ${
            prevProject ? 'md:grid-cols-12' : 'md:grid-cols-1'
          }`}
        >
          {/* Previous Project */}
          {prevProject && (
            <Link
              href={`/projects/${prevProject.id}`}
              className="flex flex-col justify-between group md:col-span-4"
            >
              <div className="mb-4">
                <span className="block mb-2 font-sans text-xs text-neutral-500 dark:text-neutral-400">
                  Previous Project
                </span>
                <h3
                  className={`text-2xl font-medium transition-colors md:text-3xl text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 ${
                    prevProject.heroFontClass || ''
                  }`}
                >
                  {prevProject.name}
                </h3>
              </div>

              {prevProject.media?.hero && (
                <div className="relative w-full overflow-hidden aspect-video rounded-xl bg-neutral-200 dark:bg-neutral-800">
                  {prevProject.media.hero.type === 'video' ? (
                    <video
                      src={prevProject.media.hero.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src={prevProject.media.hero.src}
                      alt={prevProject.name}
                      fill
                      className="transition-transform duration-500 "
                    />
                  )}
                </div>
              )}
            </Link>
          )}

          {/* Next Project */}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.id}`}
              className={`group flex flex-col justify-between text-right ${
                prevProject ? 'md:col-span-8' : 'md:col-span-12'
              }`}
            >
              <div className="mb-4">
                <span className="block mb-2 font-sans text-xs text-neutral-500 dark:text-neutral-400">
                  Next Project
                </span>
                <h3
                  className={`text-3xl font-medium transition-colors md:text-5xl text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 ${
                    nextProject.heroFontClass || ''
                  }`}
                >
                  {nextProject.name}
                </h3>
              </div>

              {nextProject.media?.hero && (
                <div className="relative w-full overflow-hidden aspect-video rounded-2xl bg-neutral-200 dark:bg-neutral-800">
                  {nextProject.media.hero.type === 'video' ? (
                    <video
                      src={nextProject.media.hero.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full transition-transform duration-500 "
                    />
                  ) : (
                    <Image
                      src={nextProject.media.hero.src}
                      alt={nextProject.name}
                      fill
                      className="transition-transform duration-500"
                    />
                  )}
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}