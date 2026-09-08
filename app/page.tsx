import React from 'react';
import Hero from '@/components/hero';
import Nav from '@/components/nav';
import About from '@/components/about';
import Projects from '@/components/project';
import Playground from '@/components/playground';
import CTASection from '@/components/cta';
import Footer from '@/components/footer';
import HandsSection from '@/components/hands';

const Page = () => {
  return (
    <main className='min-h-screen w-full bg-background text-foreground font-sans selection:bg-foreground selection:text-background antialiased overflow-x-hidden'>
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
