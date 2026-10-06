'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA, ProjectData } from '@/data/projects';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectPaginationProps {
  currentSlug: string;
}

export default function ProjectPagination({ currentSlug }: ProjectPaginationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prevCardRef = useRef<HTMLAnchorElement>(null);
  const nextCardRef = useRef<HTMLAnchorElement>(null);

  const projectList: ProjectData[] = Object.values(PROJECTS_DATA);
  const currentIndex = projectList.findIndex((p) => p.id === currentSlug);

  if (currentIndex === -1) return null;

  const prevProject = currentIndex > 0 ? projectList[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projectList.length - 1 ? projectList[currentIndex + 1] : null;

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal Previous Project Card
      if (prevCardRef.current) {
        const prevText = prevCardRef.current.querySelectorAll('.reveal-text');
        const prevMedia = prevCardRef.current.querySelector('.reveal-media');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: prevCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        if (prevText.length) {
          tl.fromTo(
            prevText,
            { opacity: 0, filter: 'blur(10px)', y: 20 },
            { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
          );
        }

        if (prevMedia) {
          tl.fromTo(
            prevMedia,
            { opacity: 0, y: 30, clipPath: 'inset(10% 0% 0% 0%)' },
            { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.out' },
            '-=0.6'
          );
        }
      }

      // Reveal Next Project Card
      if (nextCardRef.current) {
        const nextText = nextCardRef.current.querySelectorAll('.reveal-text');
        const nextMedia = nextCardRef.current.querySelector('.reveal-media');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: nextCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        if (nextText.length) {
          tl.fromTo(
            nextText,
            { opacity: 0, filter: 'blur(10px)', y: 20 },
            { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
          );
        }

        if (nextMedia) {
          tl.fromTo(
            nextMedia,
            { opacity: 0, y: 30, clipPath: 'inset(10% 0% 0% 0%)' },
            { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.out' },
            '-=0.6'
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prevProject, nextProject]);

  if (!prevProject && !nextProject) return null;

  return (
    <section ref={sectionRef} className="w-full py-20 overflow-hidden bg-background text-foreground">
      <div className="w-full px-6 mx-auto max-w-7xl md:px-12">
        <div
          className={`grid grid-cols-1 gap-10 md:gap-16 items-end ${
            prevProject ? 'md:grid-cols-12' : 'md:grid-cols-1'
          }`}
        >
          {/* Previous Project */}
          {prevProject && (
            <Link
              ref={prevCardRef}
              href={`/projects/${prevProject.id}`}
              className="flex flex-col justify-between group md:col-span-4"
            >
              <div className="mb-4">
                <span className="reveal-text block mb-2 font-sans text-xs text-neutral-500 dark:text-neutral-400 will-change-[opacity,filter,transform]">
                  Previous Project
                </span>
                <h3
                  className={`reveal-text text-2xl font-medium transition-colors md:text-3xl text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 will-change-[opacity,filter,transform] ${
                    prevProject.heroFontClass || ''
                  }`}
                >
                  {prevProject.name}
                </h3>
              </div>

              {prevProject.media?.hero && (
                <div className="reveal-media relative w-full overflow-hidden aspect-video rounded-xl bg-neutral-200 dark:bg-neutral-800 will-change-[opacity,transform,clip-path]">
                  {prevProject.media.hero.type === 'video' ? (
                    <video
                      src={prevProject.media.hero.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src={prevProject.media.hero.src}
                      alt={prevProject.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              )}
            </Link>
          )}

          {/* Next Project */}
          {nextProject && (
            <Link
              ref={nextCardRef}
              href={`/projects/${nextProject.id}`}
              className={`group flex flex-col justify-between text-right ${
                prevProject ? 'md:col-span-8' : 'md:col-span-12'
              }`}
            >
              <div className="mb-4">
                <span className="reveal-text block mb-2 font-sans text-xs text-neutral-500 dark:text-neutral-400 will-change-[opacity,filter,transform]">
                  Next Project
                </span>
                <h3
                  className={`reveal-text text-3xl font-medium transition-colors md:text-5xl text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 will-change-[opacity,filter,transform] ${
                    nextProject.heroFontClass || ''
                  }`}
                >
                  {nextProject.name}
                </h3>
              </div>

              {nextProject.media?.hero && (
                <div className="reveal-media relative w-full overflow-hidden aspect-video rounded-2xl bg-neutral-200 dark:bg-neutral-800 will-change-[opacity,transform,clip-path]">
                  {nextProject.media.hero.type === 'video' ? (
                    <video
                      src={nextProject.media.hero.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src={nextProject.media.hero.src}
                      alt={nextProject.name}
                      fill
                      className=""
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