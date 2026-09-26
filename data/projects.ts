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
  heroFontClass?: string;
  overviewParagraph1: string;
  overviewParagraph2: string;
  challengesParagraph1: string;
  challengesParagraph2: string;
  research: string;
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
      'Slash UI is a modern component library designed to make interfaces faster, clearer, and more consistent.',
    overviewParagraph2:
      'From reusable components to motion-ready patterns, Slash UI brings the essentials together in one flexible system.',
    challengesParagraph1:
      'Building interfaces from scratch can quickly become repetitive.',
    challengesParagraph2:
      'Components get rebuilt, styles drift, and small inconsistencies start to appear across different interfaces.',
    research:
      'Slash UI brings reusable components, clear visual rules, and flexible patterns into one system.',
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
        src: '/project/slashui/slash-video.mp4',
      },
      challengesLeft: {
        type: 'video',
        src: '/project/slashui/slash-video-2.mp4',
      },
      challengesRight: {
        type: 'video',
        src: '/project/slashui/slash-video-3.mp4',
      },
      research: {
        type: 'video',
        src: '/project/slashui/slash-video-4.mp4',
      },
      solutionVideo: {
        type: 'video',
        src: '/project/slashui/slash-video-5.mp4',
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
    research: '',
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
  questsboard: {
    id: 'questsboard',
    name: 'QuestsBoard',
    heroFontClass: 'font-oi',
    overviewParagraph1: '',
    overviewParagraph2: '',
    challengesParagraph1: '',
    challengesParagraph2: '',
    research: '',
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
  karma: {
    id: 'karma',
    name: 'Karma',
    heroFontClass: 'font-bebas-neue',
    overviewParagraph1: '',
    overviewParagraph2: '',
    challengesParagraph1: '',
    challengesParagraph2: '',
    research: '',
    solution: '',
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
        src: '/project/karma/karma-video-1.mp4',
      },
      challengesLeft: {
        type: 'video',
        src: '/project/karma/karma-video-2.mp4',
      },
      challengesRight: {
        type: 'video',
        src: '/project/karma/karma-video-3.mp4',
      },
      research: {
        type: 'video',
        src: '/project/karma/karma-video-4.mp4',
      },
      solutionVideo: {
        type: 'video',
        src: '/project/karma/karma-video-5.mp4',
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
