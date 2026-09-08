'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { TransitionLink } from './page-transition';

const navItems = [
  { name: 'ME', href: '/me' },
  { name: 'PROJECTS', href: '/projects' },
  { name: 'PLAYGROUND', href: '/playground' },
  { name: 'CONTACT', href: '/contact' },
];

const SCRAMBLE_CHARS = '/\\<>[]{}*#+$%';

const AnimatedLogo = () => {
  const slashRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  const handleHover = () => {
    if (isAnimating.current || !slashRef.current) return;
    isAnimating.current = true;

    const el = slashRef.current;
    let frame = 0;
    const maxFrames = 12;

    // 1. Scramble character effect
    const interval = setInterval(() => {
      frame++;
      if (frame < maxFrames) {
        el.textContent =
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      } else {
        clearInterval(interval);
        el.textContent = '/';
      }
    }, 30);

    // 2. 3D flip + elastic scale animation
    gsap.fromTo(
      el,
      {
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
      },
      {
        rotateY: 360,
        rotateZ: 12,
        scale: 1.3,
        duration: 0.8,
        ease: 'elastic.out(1.2, 0.4)',
        onComplete: () => {
          gsap.to(el, {
            rotateZ: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              isAnimating.current = false;
            },
          });
        },
      },
    );
  };

  return (
    <TransitionLink
      href='/'
      className='group relative inline-flex items-center justify-center p-2 [perspective:1000px]'
      onMouseEnter={handleHover}
    >
      <span
        ref={slashRef}
        className='inline-block font-bold text-[16px] tracking-tighter text-foreground will-change-transform select-none'
      >
        /
      </span>
    </TransitionLink>
  );
};

const Nav = () => {
  return (
    <header className='relative z-[100] flex items-center justify-between px-5 py-2'>
      <div className='flex items-center gap-1 font-bold text-[11px] tracking-tighter uppercase'>
        <AnimatedLogo />
      </div>

      {/* Navigation Links using Azeret Mono */}
      <nav className='flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase font-mono'>
        {navItems.map((item) => (
          <TransitionLink
            key={item.name}
            href={item.href}
            className='group relative inline-flex overflow-hidden py-1'
          >
            {item.name.split('').map((char, index) => (
              <span
                key={index}
                className='relative inline-block h-[1.2em] overflow-hidden'
              >
                {/* Vertical slider wrapper for individual character */}
                <span
                  className='flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2'
                  style={{
                    transitionDelay: `${index * 25}ms`,
                  }}
                >
                  <span className='inline-block'>{char}</span>
                  <span className='inline-block'>{char}</span>
                </span>
              </span>
            ))}
          </TransitionLink>
        ))}
      </nav>
    </header>
  );
};

export default Nav;
