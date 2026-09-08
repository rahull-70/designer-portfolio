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
            className={`inline-block overflow-hidden py-3 -my-3 vertical-bottom ${
              isLastWord ? 'mr-0' : 'mr-[0.25em]'
            }`}
          >
            <span
              className={`reveal-word inline-block ${
                isPlayfair ? 'font-playfair italic font-normal px-[0.05em]' : ''
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

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

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
      className="relative w-full overflow-hidden select-none text-foreground bg-background"
    >
      {/* HERO SECTION */}
      <section
        ref={heroSectionRef}
        className="relative h-screen w-full flex flex-col justify-between"
      >
        {/* HERO TEXT OVERLAYS - Strictly px-5 to match Nav */}
        <div
          ref={textContainerRef}
          className="relative z-20 w-full h-full flex flex-col justify-between px-5 py-7 pointer-events-none"
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

          {/* Bottom Right Heading Block */}
          <div className="text-right font-sans self-end pb-12 sm:pb-16 2xl:pb-20 pr-0">
            <h1 className="text-[clamp(4.5rem,10vw,15rem)] leading-[0.85] tracking-tight flex flex-col items-end">
              <span className="block pr-0">
                {/* <SplitText text="Less Noise" /> */}
              </span>

              {/* Inline heading row with proportional negative offset */}
              <span className="inline-flex items-center -mt-[0.1em] font-playfair italic font-normal pr-0">
                {/* <SplitText text="Scream" playfairWords={['scream']} /> */}
              </span>
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;