'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplitTextProps {
  text: string;
  playfairWords?: string[];
  className?: string;
}

const SplitText = ({
  text,
  playfairWords = [],
  className = '',
}: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isPlayfair = playfairWords.some(
          (w) => w.toLowerCase() === cleanWord
        );
        const isLastWord = index === words.length - 1;

        return (
          <span
            key={index}
            className={`reveal-word inline-block opacity-0 blur-[12px] will-change-[opacity,filter,transform] ${
              isLastWord ? 'mr-0' : 'mr-[0.25em]'
            } ${
              isPlayfair ? 'font-playfair italic font-normal px-[0.05em]' : ''
            }`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      const words = container?.querySelectorAll('.reveal-word');
      const nameReveal = container?.querySelectorAll('.reveal-name');

      const tl = gsap.timeline();

      if (words && words.length > 0) {
        tl.fromTo(
          words,
          {
            opacity: 0,
            filter: 'blur(12px)',
            y: 16,
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'power3.out',
          }
        );
      }

      if (nameReveal && nameReveal.length > 0) {
        tl.fromTo(
          nameReveal,
          {
            opacity: 0,
            filter: 'blur(16px)',
            y: 30,
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.6'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none text-foreground bg-background"
    >
      
      {/* NOISE BACKGROUND OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.07] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="hero-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-noise)" />
        </svg>
      </div>

      {/* HERO SECTION */}
      <section
        ref={heroSectionRef}
        className="relative z-10 flex flex-col justify-between w-full h-screen"
      >
        {/* TOP CONTENT CONTAINER */}
        <div
          ref={textContainerRef}
          className="relative z-20 flex flex-col justify-between w-full px-5 pointer-events-none py-7"
        >
          {/* Top Left Paragraph */}
          <div className="max-w-md pt-20 text-[20px] leading-snug">
            <p className="font-sans text-justify">
              <SplitText
                text="Crafting intuitive interfaces and thoughtful user experiences that turn complex ideas into simple, engaging products."
                playfairWords={['complex', 'ideas']}
              />
            </p>
          </div>
        </div>

        {/* BOTTOM DISPLAY NAME - CENTERED & EXPANDED */}
        <div className="flex items-end justify-center w-full pb-2 pointer-events-none sm:pb-15">
          <h1 className="flex items-baseline justify-center tracking-[-0.04em] text-[17.5vw] leading-[0.8] font-light text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
            <span className="reveal-name inline-block opacity-0 blur-[16px] will-change-[opacity,filter,transform]">
              rahul
            </span>
            <span className="reveal-name inline-block opacity-0 blur-[16px] will-change-[opacity,filter,transform] font-playfair italic font-normal ml-[0.08em]">
              parihar
            </span>
          </h1>
        </div>
      </section>
    </div>
  );
};

export default Hero;