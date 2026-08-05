import Image from 'next/image';
import Link from 'next/link';
import { AudioLinesIcon } from './ui/audio-lines';

const About = () => {
  return (
    <section className='relative min-h-screen w-full px-8 md:px-16 py-20 overflow-hidden flex flex-col justify-between select-none'>
      {/* Top Headline Section */}
      <div className='relative z-10 max-w-4xl pt-15'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-sans leading-[1.2] tracking-tight'>
          <span className=''>I create</span>{' '}
          <span className='font-playfair italic'>thoughtful interfaces</span>{' '}
          <span className=''>where d</span>esign meets{' '}
          <span className='font-playfair italic'>usability</span>,{' '}
          <span className=''>transforming complex ideas into simple,</span>{' '}
          meaningful digital{' '}
          <span className='font-playfair italic'>experiences.</span>
        </h2>
      </div>

      {/* Center Image Container */}
      <div className='absolute inset-0 flex items-end justify-center pointer-events-none z-20'>
        <div className='relative w-[340px] sm:w-[420px] md:w-[700px] h-[100vh]'>
          <Image
            src='/me.png'
            alt='Portrait'
            fill
            priority
            className='object-contain object-bottom'
          />
        </div>
      </div>

      {/* Audio/Music Waveform Icon - Right Middle */}
      <div className='absolute top-[40%] right-12 md:right-200 z-10 opacity-80 hover:cursor-pointer'>
        <AudioLinesIcon />
      </div>

      {/* Bottom Row Information */}
      <div className='relative z-30 flex items-end justify-between w-full pt-16'>
        {/* Left Side Tag */}
        <Link href='/me' className='text-md tracking-wider text-[#212529]/70 '>
          Info
        </Link>

        {/* Right Side Description Box */}
        <p className='max-w-xl text-xs sm:text-sm font-sans font-normal leading-relaxed text-[#212529]/80'>
          I design clear, intuitive, and visually refined interfaces by
          understanding real user needs creating products that don't just look
          good, but make tech better to use.
        </p>
      </div>
    </section>
  );
};

export default About;
