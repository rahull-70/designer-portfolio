'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Static imports for light above-the-fold content
import Nav from '@/components/nav';
import Hero from '@/components/hero';

// Dynamic imports with ssr: false for heavy client components
const HandsSection = dynamic(() => import('@/components/hands'), {
  ssr: false,
  loading: () => <div className="w-full min-h-screen bg-background" />,
});

const About = dynamic(() => import('@/components/about'));

const Projects = dynamic(() => import('@/components/project'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-background" />,
});

const Playground = dynamic(() => import('@/components/playground'), {
  ssr: false,
  loading: () => <div className="w-full min-h-screen bg-background" />,
});

const CTASection = dynamic(() => import('@/components/cta'), {
  ssr: false,
  loading: () => <div className="w-full min-h-screen bg-background" />,
});

const Footer = dynamic(() => import('@/components/footer'));

const Page = () => {
  return (
    <main className="w-full min-h-screen overflow-x-hidden font-sans antialiased bg-background text-foreground selection:bg-foreground selection:text-background">
      <Nav />
      <Hero />
      <HandsSection />
      <About />
      <Projects />
      <Playground />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Page;