'use client';

import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

interface TransitionContextType {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const isAnimating = useRef(false);

  // SVG Curve Path States for GSAP Morphing
  const initialPath = 'M 0 100 V 100 Q 50 100 100 100 V 100 Z';
  const targetPath = 'M 0 100 V 0 Q 50 0 100 0 V 100 Z';
  const curvePath = 'M 0 100 V 0 Q 50 -30 100 0 V 100 Z';

  const navigate = (href: string) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const overlay = overlayRef.current;
    const path = pathRef.current;

    if (!overlay || !path) {
      router.push(href);
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Trigger Navigation halfway through animation
        router.push(href);

        // Animate Curtain Out / Exit
        gsap
          .timeline({
            delay: 0.1,
            onComplete: () => {
              isAnimating.current = false;
            },
          })
          .to(path, {
            attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 Z' },
            duration: 0.7,
            ease: 'power4.inOut',
          })
          .set(overlay, { pointerEvents: 'none' })
          .set(path, { attr: { d: initialPath } });
      },
    });

    // Animate Curtain In / Cover Screen
    tl.set(overlay, { pointerEvents: 'auto' })
      .to(path, {
        attr: { d: curvePath },
        duration: 0.45,
        ease: 'power3.in',
      })
      .to(path, {
        attr: { d: targetPath },
        duration: 0.35,
        ease: 'power3.out',
      });
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* SVG Transition Overlay */}
      {/* <div
        ref={overlayRef}
        className='fixed inset-0 z-[9999] pointer-events-none w-screen h-screen'
      >
        <svg
          className='w-full h-full fill-zinc-950 dark:fill-zinc-100 block'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
        >
          <path
            ref={pathRef}
            d={initialPath}
            vectorEffect='non-scaling-stroke'
          />
        </svg>
      </div> */}
    </TransitionContext.Provider>
  );
}

// Drop-in replacement for standard next/link
interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TransitionLink({
  href,
  children,
  className = '',
  ...props
}: TransitionLinkProps) {
  const { navigate } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname === href) return;
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
