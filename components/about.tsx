'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MusicPlayer from './ui/music-player'; // Simply import your standalone component

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
          (w) => w.toLowerCase() === cleanWord,
        );

        return (
          <React.Fragment key={index}>
            <span
              className={`reveal-word inline opacity-0 blur-[8px] will-change-[opacity,filter] ${
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

    let ctx: gsap.Context;

    const timer = setTimeout(() => {
      ctx = gsap.context((self) => {
        [headlineRef.current, paragraphRef.current].forEach((textBlock) => {
          if (!textBlock) return;
          const words = textBlock.querySelectorAll('.reveal-word');

          if (words.length > 0) {
            gsap.fromTo(
              words,
              { opacity: 0, filter: 'blur(8px)' },
              {
                scrollTrigger: {
                  trigger: textBlock,
                  start: 'top 85%',
                  end: 'top 40%',
                  scrub: 0.5,
                  fastScrollEnd: true,
                },
                opacity: 1,
                filter: 'blur(0px)',
                stagger: 0.02,
                ease: 'power1.out',
              },
            );
          }
        });

        if (imageWrapperRef.current) {
          gsap.fromTo(
            imageWrapperRef.current,
            { opacity: 0, scale: 1.15, filter: 'blur(10px)', y: 30 },
            {
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
                end: 'bottom 40%',
                scrub: 0.8,
                fastScrollEnd: true,
              },
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              y: 0,
              ease: 'power2.out',
            },
          );
        }
      }, containerRef);

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className='relative min-h-screen w-full px-5 py-20 overflow-hidden flex flex-col justify-between select-none text-zinc-900 bg-white transform-gpu'
    >
      {/* Top Headline Section */}
      <div
        ref={headlineRef}
        className='relative max-w-4xl pt-15 text-zinc-900 z-20'
      >
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-sans text-justify leading-tight'>
          <SplitText
            text='I create thoughtful interfaces where design meets usability , transforming complex ideas into simple, meaningful digital experiences.'
            playfairWords={[
              'thoughtful',
              'interfaces',
              'usability',
              'experiences.',
            ]}
          />
        </h2>
      </div>

      {/* Center Image Container */}
      <div className='absolute inset-0 flex items-end justify-center pointer-events-none z-10'>
        <div
          ref={imageWrapperRef}
          className='relative w-[340px] sm:w-[420px] md:w-[700px] h-[100vh] opacity-0 transform-gpu will-change-[transform,opacity,filter]'
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
          className='group relative inline-flex overflow-hidden text-md hover:opacity-100 transition-opacity mb-20'
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
          className='max-w-md text-[20px] font-sans text-justify '
        >
          <SplitText
            text="I design clear, intuitive, and visually refined interfaces by understanding real user needs creating products that don't just look good, but make tech better to use."
            playfairWords={['clear,', 'intuitive,', 'refined', 'needs']}
          />
        </p>
      </div>
    </section>
  );
}