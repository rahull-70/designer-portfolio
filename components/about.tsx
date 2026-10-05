'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MusicPlayer from './ui/music-player';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  playfairWords?: string[];
  className?: string;
}

const SplitText = React.memo(({
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
          (w) => w.replace(/[^\w\s]/gi, '').toLowerCase() === cleanWord,
        );

        return (
          <React.Fragment key={index}>
            <span
              className={`reveal-word inline-block opacity-0 translate-y-3 will-change-[opacity,transform] ${
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
});

SplitText.displayName = 'SplitText';

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Top Headline Animation
      if (headlineRef.current) {
        const headlineWords = headlineRef.current.querySelectorAll('.reveal-word');
        if (headlineWords.length > 0) {
          gsap.fromTo(
            headlineWords,
            { opacity: 0, y: 12 },
            {
              scrollTrigger: {
                trigger: headlineRef.current,
                start: 'top 85%',
                end: 'bottom 55%',
                scrub: 1,
              },
              opacity: 1,
              y: 0,
              stagger: 0.04,
              ease: 'power1.out',
            },
          );
        }
      }

      // Bottom Paragraph Animation
      if (paragraphRef.current) {
        const paragraphWords = paragraphRef.current.querySelectorAll('.reveal-word');
        if (paragraphWords.length > 0) {
          gsap.fromTo(
            paragraphWords,
            { opacity: 0, y: 12 },
            {
              scrollTrigger: {
                trigger: paragraphRef.current,
                start: 'top 90%',
                end: 'top 65%',
                scrub: 1,
              },
              opacity: 1,
              y: 0,
              stagger: 0.04,
              ease: 'power1.out',
            },
          );
        }
      }

      // Center Image Animation
      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { opacity: 0, scale: 1.08, y: 20 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              end: 'bottom 40%',
              scrub: 1,
            },
            opacity: 1,
            scale: 1,
            y: 0,
            ease: 'power2.out',
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className='relative flex flex-col justify-between w-full min-h-screen px-5 py-20 overflow-hidden select-none'
    >
      {/* Top Headline Section */}
      <div
        ref={headlineRef}
        className='relative z-20 max-w-4xl pt-15 text-zinc-900'
      >
        <h2 className='font-sans text-3xl leading-tight text-justify sm:text-4xl md:text-5xl'>
          <SplitText
            text='I create thoughtful interfaces where design meets usability, transforming complex ideas into simple, meaningful digital experiences.'
            playfairWords={[
              'thoughtful',
              'interfaces',
              'usability',
              'experiences',
            ]}
          />
        </h2>
      </div>

      {/* Center Image Container */}
      <div className='absolute inset-0 z-10 flex items-end justify-center pointer-events-none'>
        <div
          ref={imageWrapperRef}
          className='relative w-[340px] sm:w-[420px] md:w-[700px] h-[100vh] opacity-0 transform-gpu will-change-[transform,opacity]'
        >
          <Image
            src='/me.png'
            alt='Portrait'
            fill
            priority
            sizes='(max-width: 640px) 340px, (max-width: 768px) 420px, 700px'
            className='object-contain object-bottom'
          />
        </div>
      </div>

      {/* Isolated Music Player Component */}
      <div className='absolute top-[15%] sm:top-[20%] right-6 sm:right-12 md:right-20 z-50'>
        <MusicPlayer iconSize={28} />
      </div>

      {/* Bottom Row Information */}
      <div className='relative z-30 flex items-end justify-between w-full pt-16 text-zinc-900'>
        <Link
          href='/me'
          className='relative inline-flex mb-20 overflow-hidden transition-opacity group text-md hover:opacity-100'
        >
          <span className='inline-flex'> 
            {'Info'.split('').map((char, index) => (
              <span
                key={index}
                className='relative inline-block h-[1.2em] overflow-hidden'
              >
                <span
                  className='flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2'
                  style={{ transitionDelay: `${index * 25}ms` }}
                >
                  <span className='inline-block'>{char}</span>
                  <span className='inline-block'>{char}</span>
                </span>
              </span>
            ))}
          </span>
        </Link>

        <p
          ref={paragraphRef}
          className='max-w-md text-[16px] font-sans text-justify'
        >
          <SplitText
            text="I design clear, intuitive, and visually refined interfaces by understanding real user needs creating products that don't just look good, but make tech better to use."
            playfairWords={['clear', 'intuitive', 'refined', 'needs', ]}
          />
        </p>
      </div>
    </section>
  );
}