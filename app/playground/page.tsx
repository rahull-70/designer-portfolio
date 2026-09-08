'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

// 6 empty card blocks
const CARDS = [1, 2, 3, 4, 5, 6];

interface SplitTextProps {
  text: string;
  serifWords?: string[];
  className?: string;
}

const SplitText = ({
  text,
  serifWords = [],
  className = '',
}: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isSerif = serifWords.some((w) => w.toLowerCase() === cleanWord);
        const isLastWord = index === words.length - 1;

        return (
          <span
            key={index}
            className={`inline-block overflow-hidden py-3 -my-3 vertical-bottom ${
              isLastWord ? 'mr-0' : 'mr-[0.25em]'
            }`}
          >
            <span
              className={`reveal-word inline-block ${
                isSerif ? 'font-serif italic font-normal px-[0.05em]' : ''
              }`}
            >
              {word}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      const words = container?.querySelectorAll('.reveal-word');

      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          {
            yPercent: 130,
            rotateX: -20,
          },
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.025,
            ease: 'power4.out',
            force3D: true,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full select-none text-foreground bg-background flex flex-col justify-between"
    >
      <Nav />

      <main className="w-full px-5 pt-28 pb-20 flex-grow">
        {/* Header Text Section */}
        <div className="max-w-xl pb-12 sm:pb-16">
          <h1 className="text-base sm:text-[20px] leading-snug font-sans">
            <SplitText
              text="A collection of ideas, experiments, turns into interfaces. and components—where curiosity turns into interfaces."
              serifWords={['ideas', 'experiments', 'components']}
            />
          </h1>
        </div>

        {/* 2-Column Grid Layout with 1 Gap and Pure Solid Rectangle Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {CARDS.map((id) => (
            <div
              key={id}
              className="w-full aspect-[2/1] bg-zinc-100 dark:bg-zinc-900/40 transition-opacity hover:opacity-80 cursor-pointer"
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}