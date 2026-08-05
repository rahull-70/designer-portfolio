import React from 'react';

const Hero = () => {
  return (
    <div className='relative min-h-screen w-full overflow-hidden select-none'>
      {/* Top Left Paragraph */}
      <div className='max-w-md px-8 md:px-16 pt-32 text-sm'>
        <p className='font-sans leading-relaxed'>
          Crafting intuitive interfaces and thoughtful user experiences that{' '}
          turn <span className='font-playfair italic'>complex ideas</span> into
          simple, engaging products.
        </p>
      </div>

      {/* Bottom Right Heading Block */}
      <div className='absolute right-0 bottom-20  px-8 md:px-16 text-right font-sans'>
        <h1 className='text-7xl sm:text-8xl md:text-[140px] lg:text-[180px] xl:text-[200px] leading-none tracking-tight'>
          Design Beyond <br />
          <span className='font-playfair italic'>Screens.</span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
