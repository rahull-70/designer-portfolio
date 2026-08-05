import React from 'react';
import Hero from '@/components/hero';
import Nav from '@/components/nav';
import About from '@/components/about';

const Page = () => {
  return (
    <main className='min-h-screen w-full bg-background text-foreground font-sans selection:bg-foreground selection:text-background antialiased'>
      <Nav />
      <Hero />
      <About />
    </main>
  );
};

export default Page;
