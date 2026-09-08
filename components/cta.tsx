'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isPlayfair = playfairWords.some(
          (w) => w.toLowerCase() === cleanWord,
        );

        return (
          <React.Fragment key={index}>
            <span
              className={`reveal-word inline opacity-0 blur-[10px] will-change-[opacity,filter] ${
                isPlayfair ? 'italic font-playfair' : ''
              }`}
            >
              {word}
            </span>
            {index < words.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textBlock1Ref = useRef<HTMLDivElement>(null);
  const textBlock2Ref = useRef<HTMLDivElement>(null);
  const imageWrap1Ref = useRef<HTMLDivElement>(null);
  const imageWrap2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Slower Text blur reveals (extended scroll distance)
      [textBlock1Ref.current, textBlock2Ref.current].forEach((block) => {
        if (!block) return;
        const words = block.querySelectorAll('.reveal-word');
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { opacity: 0, filter: 'blur(10px)' },
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.05,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: block,
                start: 'top 90%',
                end: 'top 15%',
                scrub: 1.5,
              },
            }
          );
        }
      });

      // Slower Curtain Reveal Animation for Images
      [imageWrap1Ref.current, imageWrap2Ref.current].forEach((wrap) => {
        if (!wrap) return;

        const img = wrap.querySelector('img');

        gsap.fromTo(
          wrap,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 95%',
              end: 'top 10%',
              scrub: 1.8,
            },
          }
        );

        // Counter-parallax/zoom effect
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.3, y: -40 },
            {
              scale: 1,
              y: 0,
              ease: 'power1.inOut',
              scrollTrigger: {
                trigger: wrap,
                start: 'top 95%',
                end: 'top 10%',
                scrub: 1.8,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none bg-background text-foreground"
    >
      {/* SECTION 1: Top CTA */}
      <section className="relative w-full min-h-screen flex flex-col md:grid md:grid-cols-12 items-center py-20 overflow-hidden">
        {/* Pushed Text Block: Centered near columns 3-7 directly above bottom image */}
        <div
          ref={textBlock1Ref}
          className="px-8 md:px-0 md:col-span-5 md:col-start-3 max-w-xs md:max-w-md w-full mb-12 md:mb-0"
        >
          <p className="font-sans text-lg md:text-[22px] leading-relaxed text-justify">
            <SplitText
              text="Looking for an internship or full-time opportunity. Excited to join a creative team, solve meaningful problems, and design experiences people love using."
              playfairWords={[
                'internship',
                'or',
                'full-time',
                'opportunity.',
              ]}
            />
          </p>
        </div>

        {/* Right Image Container (Flush right edge) */}
        <div className="md:col-span-4 md:col-start-9 w-full flex justify-end">
          <div
            ref={imageWrap1Ref}
            className="relative w-[85vw] sm:w-[50vw] md:w-full h-[50vh] md:h-[75vh] overflow-hidden shadow-2xl mr-0 rounded-l-2xl md:rounded-l-3xl will-change-[clip-path]"
            style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          >
            <span className="absolute top-4 left-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>
            <span className="absolute top-4 right-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>
            <span className="absolute bottom-4 left-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>
            <span className="absolute bottom-4 right-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>

            <Image
              src="/img-1.png"
              alt="Sculpture art"
              fill
              priority
              className="object-cover will-change-transform"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: Bottom CTA */}
      <section className="w-full min-h-screen flex flex-col-reverse md:grid md:grid-cols-12 items-center px-8 md:px-16 py-20 gap-12">
        {/* Left Image Container (Aligned to columns 2-6) */}
        <div className="md:col-span-5 md:col-start-2 w-full flex justify-start">
          <div
            ref={imageWrap2Ref}
            className="relative w-[80vw] sm:w-[50vw] md:w-full h-[50vh] md:h-[75vh] overflow-hidden shadow-2xl rounded-2xl md:rounded-3xl will-change-[clip-path]"
            style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          >
            <span className="absolute top-4 left-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>
            <span className="absolute top-4 right-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>
            <span className="absolute bottom-4 left-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>
            <span className="absolute bottom-4 right-4 z-20 text-[11px] font-mono text-foreground/60 pointer-events-none">
              +
            </span>

            <Image
              src="/img-2.png"
              alt="Sculpture art fragments"
              fill
              priority
              className="object-cover will-change-transform"
            />
          </div>
        </div>

        {/* Right Text Block (Aligned to columns 8-11) */}
        <div
          ref={textBlock2Ref}
          className="md:col-span-4 md:col-start-8 max-w-xs md:max-w-sm w-full"
        >
          <p className="font-sans text-lg md:text-[22px] leading-relaxed text-justify">
            <SplitText
              text="Currently available for internships, freelance, and collaborative projects. Let's create products that are simple thoughtful and impactful work."
              playfairWords={[
                'internships,',
                'freelance,',
                'and',
                'collaborative',
                'projects.',
              ]}
            />
          </p>
        </div>
      </section>
    </div>
  );
}