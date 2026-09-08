'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/footer';
import Nav from '@/components/nav';
import { PlusIcon } from '@/components/ui/plus';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// Helper Component: SplitText
// -----------------------------------------------------------------------------
interface SplitTextProps {
  text: string;
  playfairWords?: string[];
  wordClassName?: string;
  className?: string;
  allPlayfair?: boolean;
}

const SplitText = ({
  text,
  playfairWords = [],
  wordClassName = 'reveal-word',
  className = '',
  allPlayfair = false,
}: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isPlayfair =
          allPlayfair ||
          playfairWords.some(
            (w) => w.replace(/[^\w\s]/gi, '').toLowerCase() === cleanWord,
          );

        return (
          <React.Fragment key={index}>
            <span
              className={`${wordClassName} inline-block opacity-0 blur-[8px] translate-y-4 will-change-[transform,opacity,filter] ${
                isPlayfair ? 'font-playfair italic font-normal' : ''
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

// -----------------------------------------------------------------------------
// FAQ Data & Item Component
// -----------------------------------------------------------------------------
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}
const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className='faq-item border-b border-foreground/20 py-6 transition-colors duration-300 will-change-[transform,opacity,filter]'>
      <button
        onClick={onToggle}
        className='w-full flex justify-between items-center text-left group focus:outline-none cursor-pointer'
      >
        <span className='text-xl sm:text-2xl md:text-3xl font-normal tracking-tight text-foreground/90 group-hover:text-foreground transition-colors'>
          {question}
        </span>
        <PlusIcon size={24} isOpen={isOpen} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? 'grid-rows-[1fr] opacity-100 mt-4'
            : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className='overflow-hidden text-sm sm:text-base text-foreground/70 leading-relaxed max-w-xl'>
          {answer}
        </div>
      </div>
    </div>
  );
};
// -----------------------------------------------------------------------------
// Main Combined Page Component
// -----------------------------------------------------------------------------
export default function MeInfoPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  // Section 1 Refs
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const heroSubtextRef = useRef<HTMLDivElement>(null);

  // Section 2 Refs
  const aboutHeadingRef = useRef<HTMLHeadingElement>(null);
  const aboutSubHeadingRef = useRef<HTMLHeadingElement>(null);
  const aboutImageWrapRef = useRef<HTMLDivElement>(null);
  const aboutParagraphRef = useRef<HTMLDivElement>(null);

  // Section 3 Ref
  const quoteRef = useRef<HTMLHeadingElement>(null);

  // Section 4 Refs
  const faqRef = useRef<HTMLDivElement>(null);
  const faqTagRef = useRef<HTMLDivElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: 'What drives your design process?',
      answer:
        'Empathy, clarity, and rapid iteration. I prioritize deeply understanding the core problem before jumping into visual solutions.',
    },
    {
      question: 'What kind of work are you looking for?',
      answer:
        'I specialize in building interactive web experiences, minimal UI design systems, and thoughtful product interactions.',
    },
    {
      question: 'What inspires your work?',
      answer:
        'Minimalist architecture, tactile interface interactions, editorial typography, and high-performance digital craft.',
    },
    {
      question: "What's your design philosophy?",
      answer:
        "Function dictates structure, but detail creates emotion. If design doesn't feel effortless to use, it isn't finished.",
    },
  ];

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // ---------------- SECTION 1 GSAP ----------------
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroHeadlineRef.current) {
        const heroWords =
          heroHeadlineRef.current.querySelectorAll('.hero-word');
        heroTl.to(heroWords, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.8,
          stagger: 0.06,
        });
      }

      heroTl.fromTo(
        heroSubtextRef.current,
        { opacity: 0, y: 20, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
        '-=0.4',
      );

      // ---------------- SECTION 2 GSAP ----------------
      if (aboutHeadingRef.current) {
        const words = aboutHeadingRef.current.querySelectorAll('.about-word-1');
        gsap.to(words, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutHeadingRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        });
      }

      if (aboutSubHeadingRef.current) {
        const words =
          aboutSubHeadingRef.current.querySelectorAll('.about-word-2');
        gsap.to(words, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutSubHeadingRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        });
      }

      if (aboutImageWrapRef.current) {
        const img = aboutImageWrapRef.current.querySelector('img');

        gsap.fromTo(
          aboutImageWrapRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: aboutImageWrapRef.current,
              start: 'top 90%',
              end: 'top 25%',
              scrub: 1.5,
            },
          },
        );

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.2, y: -30 },
            {
              scale: 1,
              y: 0,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: aboutImageWrapRef.current,
                start: 'top 90%',
                end: 'top 25%',
                scrub: 1.5,
              },
            },
          );
        }
      }

      if (aboutParagraphRef.current) {
        gsap.fromTo(
          aboutParagraphRef.current,
          { opacity: 0, y: 30, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: aboutParagraphRef.current,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          },
        );
      }

      // ---------------- SECTION 3 GSAP ----------------
      if (quoteRef.current) {
        const words = quoteRef.current.querySelectorAll('.quote-word');
        gsap.to(words, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        });
      }

      // ---------------- SECTION 4 GSAP ----------------
      if (faqRef.current) {
        if (faqTagRef.current) {
          gsap.fromTo(
            faqTagRef.current,
            { opacity: 0, y: 20, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: faqTagRef.current,
                start: 'top 85%',
              },
            },
          );
        }

        if (faqListRef.current) {
          const items = faqListRef.current.querySelectorAll('.faq-item');
          gsap.fromTo(
            items,
            { opacity: 0, y: 40, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: faqListRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <Nav />
      <div
        ref={pageRef}
        className='w-full text-foreground select-none overflow-hidden font-sans'
      >
        {/* ---------------- SECTION 1: HERO ---------------- */}
        <section className='relative w-full h-screen text-foreground flex flex-col justify-between px-5 py-8'>
          <div className='w-full h-12' />

          <main className='flex-1 flex items-center justify-center text-center px-4'>
            <h1
              ref={heroHeadlineRef}
              className='text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal tracking-tight leading-[1.15] max-w-4xl'
            >
              <SplitText
                text='Designing digital experiences that people remember.'
                playfairWords={['remember.']}
                wordClassName='hero-word'
              />
            </h1>
          </main>

          <footer className='w-full flex justify-end z-10 pb-2'>
            <div ref={heroSubtextRef} className='max-w-md text-right'>
              <p className='text-md leading-relaxed text-foreground text-justify'>
                I'm Rahul, a UI/UX designer focused on creating thoughtful
                digital products through research, strategy, and clean visual
                design.
              </p>
            </div>
          </footer>
        </section>

        {/* ---------------- SECTION 2: PHILOSOPHY / ABOUT ---------------- */}
        <section className='relative w-full min-h-screen text-foreground px-5 md:px-12 py-12 flex flex-col justify-between overflow-hidden'>
          <div className='relative w-full max-w-7xl mx-auto'>
            {/* Top Heading */}
            <div className='w-full flex justify-center z-20 relative -mb-8 md:-mb-14'>
              <h2
                ref={aboutHeadingRef}
                className='text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight leading-[1.1] text-justify max-w-7xl'
              >
                <SplitText
                  text="I believe great design isn't about adding more—it's about making every detail matter."
                  playfairWords={['design']}
                  wordClassName='about-word-1'
                />
              </h2>
            </div>

            {/* Overlapping Content Container */}
            <div className='relative w-full min-h-[750px] mt-4'>
              {/* Image Block: Shifted further left with negative margin */}
              <div
                ref={aboutImageWrapRef}
                className='relative w-full max-w-[850px] aspect-[4/5] overflow-hidden shadow-2xl z-10 -ml-12 md:-ml-32 lg:-ml-48 will-change-[clip-path]'
                style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              >
                <Image
                  src='/me-info.png'
                  alt='Rahul'
                  fill
                  priority
                  className='object-cover will-change-transform'
                />
              </div>

              {/* Second Heading: Overlapping the top-right quadrant of the image */}
              <div className='absolute top-[8%] md:top-[-3%] left-[5%] md:left-[20%] right-0 z-30 pointer-events-none'>
                <h2
                  ref={aboutSubHeadingRef}
                  className='text-2xl sm:text-4xl md:text-5xl lg:text-[62px] font-normal tracking-tight leading-[1.12] text-justify max-w-5xl'
                >
                  <SplitText
                    text='By combining user-centered thinking with clean visual design, I create digital experiences that feel intuitive, accessible, and enjoyable to use.'
                    playfairWords={['clean', 'visual', 'design,']}
                    wordClassName='about-word-2'
                  />
                </h2>
              </div>

              {/* Paragraph: Bottom right aligned */}
              <div className='absolute bottom-25 right-0 z-30 max-w-[420px] pointer-events-auto'>
                <div
                  ref={aboutParagraphRef}
                  className='font-sans text-[20px] leading-relaxed text-foreground text-justify'
                >
                  <p>
                    Every project begins with understanding people, exploring
                    ideas, and refining solutions through thoughtful iteration.
                    My goal is to design products that not only look beautiful
                    but also solve real problems with clarity and purpose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- SECTION 3: CENTERED QUOTE (ANIMATED) ---------------- */}
        <section className='relative w-full min-h-[60vh] flex items-center justify-center px-5 py-24'>
          <h2
            ref={quoteRef}
            className='text-center max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-snug tracking-wide text-foreground/90 font-normal flex flex-col items-center gap-1'
          >
            <SplitText
              text="Good design isn't just seen."
              allPlayfair={true}
              wordClassName='quote-word'
            />
            <SplitText
              text="It's understood."
              allPlayfair={true}
              wordClassName='quote-word'
            />
          </h2>
        </section>

        {/* ---------------- SECTION 4: FAQ (ACCORDION ON RIGHT) ---------------- */}
        <section
          ref={faqRef}
          className='relative w-full min-h-screen px-8 md:px-16 py-24 flex flex-col justify-center'
        >
          <div className='w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-8xl mx-auto'>
            {/* Left Tag Column */}
            <div
              ref={faqTagRef}
              className='md:col-span-3 lg:col-span-4 pt-2 opacity-0'
            >
              <span className='text-sm sm:text-base font-normal tracking-wide text-foreground/80'>
                Faq
              </span>
            </div>

            {/* Right Accordion List Column */}
            <div className='md:col-span-9 lg:col-span-8 flex justify-end'>
              <div ref={faqListRef} className='w-full'>
                {faqData.map((item, idx) => (
                  <FAQItem
                    key={idx}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openFaq === idx}
                    onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
