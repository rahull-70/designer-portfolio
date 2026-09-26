'use client';

import React, { useEffect, useRef } from 'react';
import { ProjectData } from '@/data/projects';
import gsap from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
}

const SplitText = React.memo(({ text, className = '' }: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span className="reveal-word inline-block opacity-0 translate-y-[30px] will-change-[transform,opacity] transform-gpu">
            {word}
          </span>
          {index < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
});

SplitText.displayName = 'SplitText';

export default function HeroSection({ data }: { data: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Fallback to 'font-sans' if no heroFontClass is provided
  const fontClass = data?.heroFontClass || 'font-sans';

  useEffect(() => {
    if (!containerRef.current || !headlineRef.current) return;

    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll('.reveal-word');

      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [data?.name]);

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center w-full min-h-screen px-6 py-20 overflow-hidden select-none"
    >
      <h1
        ref={headlineRef}
        className={`text-6xl sm:text-7xl md:text-9xl text-center ${fontClass}`}
      >
        <SplitText text={data?.name || ''} />
      </h1>
    </section>
  );
}