'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: 'Github', href: 'https://github.com' },
  { name: 'Dribbble', href: 'https://dribbble.com' },
  { name: 'LinkedIn', href: 'https://linkedin.com' },
  { name: 'X', href: 'https://x.com' },
];

const email = 'r.prahulparihar70@gmail.com';

interface SplitTextProps {
  text: string;
  italicWords?: string[];
  className?: string;
}

const SplitText = ({
  text,
  italicWords = [],
  className = '',
}: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isItalic = italicWords.some((w) => w.toLowerCase() === cleanWord);

        return (
          <span
            key={index}
            className={`reveal-word inline-block mr-[0.22em] opacity-0 blur-[12px] will-change-[opacity,filter,transform] ${
              isItalic ? 'font-serif italic font-normal' : ''
            }`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

export default function ContactPage() {
  const heroRef = useRef<HTMLElement>(null);
  const contactSecRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Title Word Blur Reveal Animation
      const heroWords = heroRef.current?.querySelectorAll('.reveal-word');
      if (heroWords && heroWords.length > 0) {
        gsap.fromTo(
          heroWords,
          {
            opacity: 0,
            filter: 'blur(12px)',
            y: 20,
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
          },
        );
      }

      // 2. Section 2 Contact Details Blur Reveal Stagger Animation
      const detailWords = detailsRef.current?.querySelectorAll('.reveal-word');
      if (detailWords && detailWords.length > 0) {
        gsap.fromTo(
          detailWords,
          {
            opacity: 0,
            filter: 'blur(12px)',
            y: 16,
          },
          {
            scrollTrigger: {
              trigger: contactSecRef.current,
              start: 'top 65%',
              end: 'top 25%',
              scrub: 1,
            },
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            stagger: 0.03,
            ease: 'power2.out',
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className='w-full overflow-x-hidden'>
      {/* SECTION 1: HERO SECTION */}
      <Nav />
      <section
        ref={heroRef}
        className='h-screen w-full flex flex-col justify-between relative px-5 select-none'
      >
        <div className='flex-1 flex flex-col justify-center items-center text-center'>
          <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans tracking-tight font-normal leading-[1.1] flex flex-col items-center'>
            <span className='block'>
              <SplitText text="Let's create something" />
            </span>
            <span className='block mt-2'>
              <SplitText text='meaningful.' italicWords={['meaningful']} />
            </span>
          </h1>
        </div>

        <div className='h-20 w-full' />
      </section>

      {/* SECTION 2: CONTACT DETAILS SECTION (TRUE CENTERED) */}
      <section
        ref={contactSecRef}
        className='min-h-screen w-full flex items-center justify-center px-6 sm:px-12 md:px-20 py-20 select-none'
      >
        <div className='w-full flex justify-center items-center'>
          <div
            ref={detailsRef}
            className='inline-flex flex-col space-y-10 sm:space-y-12 max-w-2xl md:max-w-5xl'
          >
            {/* Paragraph */}
            <p className='text-base sm:text-xl md:text-4xl font-sans text-justify leading-relaxed py-30'>
              <SplitText text="Whether you have an idea, an opportunity, or simply want to connect, my inbox is always open. I'd love to hear what you're building." />
            </p>

            {/* Email Block */}
            <div className='flex flex-col sm:flex-row items-start sm:gap-12 md:gap-16 py2'>
              <span className='w-24 sm:w-28 font-serif italic text-zinc-600 text-base sm:text-lg md:text-xl pt-7 shrink-0'>
                <SplitText text='Email :' italicWords={['email']} />
              </span>
              <div>
                <a
                  href={`mailto:${email}`}
                  className='group flex flex-col text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight leading-[1.05] text-zinc-900'
                >
                  <span className='reveal-word inline-block opacity-0 blur-[12px] will-change-[opacity,filter,transform] text-left'>
                    r.prahulparihar70 <br />
                    <span className='ml-12 sm:ml-24 inline-flex items-center gap-1.5'>
                      {/* 3D Vertical Flip Animation on @ */}
                      <span className='inline-block [perspective:400px]'>
                        <span className='inline-block transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(360deg)] text-zinc-500'>
                          @
                        </span>
                      </span>

                      gmail.com

                      {/* Infinite/Looping Slide Arrow Animation */}
                      <span className='relative overflow-hidden inline-flex w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 ml-1'>
                        <ArrowUpRight className='absolute inset-0 w-full h-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-full group-hover:-translate-y-full' />
                        <ArrowUpRight className='absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0 text-zinc-500' />
                      </span>
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Socials List */}
            <div className='flex flex-col sm:flex-row items-start sm:gap-12 md:gap-16'>
              <span className='w-24 sm:w-28 font-serif italic text-zinc-600 text-base sm:text-lg md:text-xl pt-1 shrink-0'>
                <SplitText text='Socials :' italicWords={['socials']} />
              </span>
              <ul className='space-y-3 text-2xl sm:text-3xl md:text-4xl font-sans leading-none'>
                {socialLinks.map((social) => (
                  <li key={social.name} className='block'>
                    <Link
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group reveal-word inline-block opacity-0 blur-[12px] will-change-[opacity,filter] text-zinc-900'
                    >
                      <span className='relative block overflow-hidden leading-none py-1'>
                        <span className='block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full'>
                          {social.name}
                        </span>
                        <span className='absolute top-0 left-0 block py-1 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0'>
                          {social.name}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}