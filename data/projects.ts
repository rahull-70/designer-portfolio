export interface FontSpec {
  name: string;
  sample: string;
  className?: string;
}

export interface ColorSpec {
  hex: string;
  rgb: string;
  rgba: string;
  isDark?: boolean;
}

export interface MediaSpec {
  type: 'video' | 'image';
  src: string;
}

export interface ProjectData {
  id: string;
  name: string;
  heroVideo?: string;
  heroFontClass?: string;
  overviewParagraph1: string;
  overviewParagraph2: string;
  challengesParagraph1: string;
  challengesParagraph2: string;
  research?: string;
  researchParagraph1: string;
  researchParagraph2: string;
  researchParagraph3: string;
  solution: string;
  systemDesign: {
    fonts: FontSpec[];
    colors: ColorSpec[];
  };
  media: {
    hero: MediaSpec;
    challengesLeft: MediaSpec;
    challengesRight: MediaSpec;
    research: MediaSpec;
    solutionVideo: MediaSpec;
    showcase1: MediaSpec;
    showcase2: MediaSpec;
    showcase3: MediaSpec;
  };
}

export const PROJECTS_DATA: Record<string, ProjectData> = {
  'slash-ui': {
    id: 'slash-ui',
    name: 'Slash UI',
    heroFontClass: 'font-hoshiko',
    overviewParagraph1:
      'Slash UI is a modern component library created to explore a more flexible way of building digital interfaces. It brings reusable components, visual foundations, interaction patterns, and motion into one system, helping designers and developers create polished experiences without rebuilding the same foundations every time.',
    overviewParagraph2:
      'The idea was to create more than a collection of components. I wanted Slash UI to provide a strong foundation while still giving each interface room to have its own personality through visual direction, interaction, and motion.',

    challengesParagraph1:
      'Many interfaces rely on the same basic building blocks, but creating more expressive experiences often means designing interactions, transitions, and animations separately. This can make the process repetitive and lead to inconsistencies across projects.',
    challengesParagraph2:
      'At the same time, a system can become too restrictive if every component follows the same visual language. The challenge was to find a balance between consistency and freedom—making the repetitive parts easier to build without limiting creativity.',
    researchParagraph1:
      'I explored existing component libraries and common interface patterns to understand how reusable systems are structured and where they can become limiting for more interactive experiences.',
    researchParagraph2:
      'This led me to focus on three ideas: consistency, flexibility, and interaction. Components needed to be reusable, but also adaptable. Visual foundations such as typography, colour, spacing, and grid needed to work together, while motion and interaction needed to feel like part of the system rather than something added afterwards.',
    researchParagraph3:
      'The goal was to understand how these elements could work together as one flexible foundation.',
    solution:
      'I wanted to create a system that could keep interfaces consistent without making them feel restricted.',
    systemDesign: {
      fonts: [
        { name: 'Inter', sample: 'Aa', className: 'font-inter' },
        { name: 'Switzer', sample: 'Aa', className: 'font-switzer' },
        { name: 'CartographCF', sample: 'Aa', className: 'font-cartograph' },
        { name: 'Hoshiko-Satsuki', sample: 'Aa', className: 'font-hoshiko' },
      ],
      colors: [
        {
          hex: '#0A0908',
          rgb: 'RGB (10, 9, 8)',
          rgba: 'RGBA (10, 9, 8, 1)',
          isDark: true,
        },
        {
          hex: '#EDF2F4',
          rgb: 'RGB (237, 242, 244)',
          rgba: 'RGBA (237, 242, 244, 1)',
          isDark: false,
        },
      ],
    },
    media: {
      hero: {
        type: 'video',
        src: '/project/slashui/slash-video.webm',
      },
      challengesLeft: {
        type: 'video',
        src: '/project/slashui/slash-video-2.webm',
      },
      challengesRight: {
        type: 'video',
        src: '/project/slashui/slash-video-3.webm',
      },
      research: {
        type: 'video',
        src: '/project/slashui/slash-video-4.webm',
      },
      solutionVideo: {
        type: 'video',
        src: '/project/slashui/slash-video-5.webm',
      },
      showcase1: {
        type: 'image',
        src: '/project/slashui/slash-img-5.jpeg',
      },
      showcase2: {
        type: 'image',
        src: '/project/slashui/slash-img-6.png',
      },
      showcase3: {
        type: 'image',
        src: '/project/slashui/slash-img-7.png',
      },
    },
  },

  '11revens': {
    id: '11revens',
    name: '11Revens',
    heroFontClass: 'font-vertikal',
    overviewParagraph1: '',
    overviewParagraph2: '',
    challengesParagraph1: '',
    challengesParagraph2: '',
    researchParagraph1: '',
    researchParagraph2: '',
    researchParagraph3: '',
    solution:
      'I wanted to bring the attitude of streetwear editorials into an ecommerce experience without losing clarity.”',
    systemDesign: {
      fonts: [
        { name: 'Vertikal', sample: 'Aa', className: 'font-vertikal' },
        { name: 'Vinas-Sans', sample: 'Aa', className: 'font-vinas-sans' },
        { name: 'Jost', sample: 'Aa', className: 'font-jost' },
        {
          name: 'Elronet-Monospace',
          sample: 'Aa',
          className: 'font-elronetmonospace',
        },
      ],
      colors: [
        {
          hex: '#000000',
          rgb: 'RGB (0, 0, 0)',
          rgba: 'RGBA (0, 0, 0, 1)',
          isDark: true,
        },
        {
          hex: '#ffffff',
          rgb: 'RGB (255, 255, 255)',
          rgba: 'RGBA (255, 255, 255, 1)',
          isDark: false,
        },
      ],
    },
    media: {
      hero: {
        type: 'image',
        src: '/project/11revens/11revens-img-1.png',
      },
      challengesLeft: {
        type: 'image',
        src: '/project/11revens/11revens-img-2.png',
      },
      challengesRight: {
        type: 'image',
        src: '/project/11revens/11revens-img-3.png',
      },
      research: {
        type: 'image',
        src: '/project/11revens/11revens-img-4.png',
      },
      solutionVideo: {
        type: 'image',
        src: '/project/11revens/11revens-img-5.png',
      },
      showcase1: {
        type: 'image',
        src: '/project/11revens/11revens-img-6.png',
      },
      showcase2: {
        type: 'image',
        src: '/project/11revens/11revens-img-7.png',
      },
      showcase3: {
        type: 'image',
        src: '/project/11revens/11revens-img-8.png',
      },
    },
  },
  'questsboard': {
    id: 'questsboard',
    name: 'QuestsBoard',
    heroFontClass: 'font-oi',
    overviewParagraph1: '',
    overviewParagraph2: '',
    challengesParagraph1: '',
    challengesParagraph2: '',
    researchParagraph1: '',
    researchParagraph2: '',
    researchParagraph3: '',
    solution:
      'I wanted to turn everyday tasks into something that feels more engaging without making productivity feel complicated.',
    systemDesign: {
      fonts: [
        { name: 'Oi', sample: 'Aa', className: 'font-oi' },
        { name: 'Luckiest-Guy', sample: 'Aa', className: 'font-luckiest-guy' },
        { name: 'Inter', sample: 'Aa', className: 'font-inter' },
        { name: 'Comme', sample: 'Aa', className: 'font-comme' },
      ],
      colors: [
        {
          hex: '#faedcd',
          rgb: 'RGB (250, 237, 205)',
          rgba: 'RGBA (250, 237, 205, 1)',
          isDark: true,
        },
        {
          hex: '#d4a373',
          rgb: 'RGB (212, 163, 115)',
          rgba: 'RGBA (212, 163, 115, 1)',
          isDark: false,
        },
        {
          hex: '#fdfae0',
          rgb: 'RGB (253, 250, 224)',
          rgba: 'RGBA (253, 250, 224, 1)',
          isDark: false,
        },
        {
          hex: '#dadcb7',
          rgb: 'RGB (212, 163, 115)',
          rgba: 'RGBA (212, 163, 115, 1)',
          isDark: false,
        },
        {
          hex: '#000',
          rgb: 'RGB (0, 0, 0)',
          rgba: 'RGBA (0, 0, 0, 1)',
          isDark: true,
        },
        {
          hex: '#fff',
          rgb: 'RGB (255, 255, 255)',
          rgba: 'RGBA (255, 255, 255, 1)',
          isDark: false,
        },
      ],
    },
    media: {
      hero: {
        type: 'video',
        src: '/project/questboard/questsboard-video-1.mp4',
      },
      challengesLeft: {
        type: 'video',
        src: '/project/questboard/questsboard-video-2.mp4',
      },
      challengesRight: {
        type: 'video',
        src: '/project/questboard/questsboard-video-3.mp4',
      },
      research: {
        type: 'video',
        src: '/project/questboard/questsboard-video-4.mp4',
      },
      solutionVideo: {
        type: 'video',
        src: '/project/questboard/questsboard-video-5.mp4',
      },
      showcase1: {
        type: 'image',
        src: '/project/questboard/questsboard-img-6.png',
      },
      showcase2: {
        type: 'image',
        src: '/project/questboard/questsboard-img-7.png',
      },
      showcase3: {
        type: 'image',
        src: '/project/questboard/questsboard-img-8.png',
      },
    },
  },
  'karma': {
    id: 'karma',
    name: 'Karma',
    heroFontClass: 'font-bebas-neue',
    overviewParagraph1: '',
    overviewParagraph2: '',
    challengesParagraph1: '',
    challengesParagraph2: '',
    researchParagraph1: '',
    researchParagraph2: '',
    researchParagraph3: '',
    solution:
      'I wanted to create a digital space where Karma’s music and visual identity could feel like one experience.',
    systemDesign: {
      fonts: [
        { name: 'Bebas-Neue', sample: 'Aa', className: 'font-bebas-neue' },
        { name: 'Dm-mono', sample: 'Aa', className: 'font-dm-mono' },
      ],
      colors: [
        {
          hex: '#000000',
          rgb: 'RGB (0, 0, 0)',
          rgba: 'RGBA (0, 0, 0, 1)',
          isDark: true,
        },
        {
          hex: '#636363',
          rgb: 'RGB (99, 99, 99)',
          rgba: 'RGBA (99, 99, 99, 1)',
          isDark: false,
        },
        {
          hex: '#ffffff',
          rgb: 'RGB (255, 255, 255)',
          rgba: 'RGBA (255, 255, 255, 1)',
          isDark: false,
        },
      ],
    },
    media: {
      hero: {
        type: 'video',
        src: '/project/karma/karma-video-1.webm',
      },
      challengesLeft: {
        type: 'video',
        src: '/project/karma/karma-video-2.webm',
      },
      challengesRight: {
        type: 'video',
        src: '/project/karma/karma-video-3.webm',
      },
      research: {
        type: 'video',
        src: '/project/karma/karma-video-4.webm',
      },
      solutionVideo: {
        type: 'video',
        src: '/project/karma/karma-video-5.webm',
      },
      showcase1: {
        type: 'image',
        src: '/project/karma/karma-img-6.png',
      },
      showcase2: {
        type: 'image',
        src: '/project/karma/karma-img-7.png',
      },
      showcase3: {
        type: 'image',
        src: '/project/karma/karma-img-8.png',
      },
    },
  },
};
