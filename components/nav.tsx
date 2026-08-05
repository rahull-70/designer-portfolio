import Link from 'next/link';

const Nav = () => {
  return (
    <header className='relative z-10 flex items-center justify-between px-8 py-8 md:px-16'>
      <div className='flex items-center gap-1 font-bold text-2xl tracking-tighter uppercase'>
        <span>/</span>
      </div>

      {/* Navigation Links using Azeret Mono */}
      <nav className='flex items-center gap-8 text-xs font-semibold tracking-widest uppercase font-mono'>
        <Link href='/me' className='hover:opacity-60 transition-opacity'>
          ME
        </Link>
        <Link href='/projects' className='hover:opacity-60 transition-opacity'>
          PROJECTS
        </Link>
        <Link
          href='/playground'
          className='hover:opacity-60 transition-opacity'
        >
          PLAYGROUND
        </Link>
        <Link href='/contact' className='hover:opacity-60 transition-opacity'>
          CONTACT
        </Link>
      </nav>
    </header>
  );
};

export default Nav;
