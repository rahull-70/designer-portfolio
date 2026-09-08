export interface FontSpec {
  name: string;
  sample: string;
  image?: string;
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
  description: string;
  logo: string;
  heroVideo: string;
  overviewParagraph1: string;
  overviewParagraph2: string;
  challengesParagraph1: string;
  challengesParagraph2: string;
  research: string;
  solution: string;
  systemDesign: {
    fonts: FontSpec[];
    colors: ColorSpec[];
    gutter: string;
    columns: string;
    margin: string;
    maxWidth: string;
  };
  showcase: {
    mainMedia: MediaSpec; // Video / Main frame media
    secondaryMedia1: MediaSpec; // Left challenge media (slash-img-1)
    secondaryMedia2: MediaSpec;
    researchMedia?: MediaSpec; // Right challenge media (slash-img-2)
    sideVisual1: MediaSpec; // Showcase image (slash-img-5)
    sideVisual2: MediaSpec; // Showcase image (slash-img-6)
    sideVisual3: MediaSpec; // Showcase image (slash-img-7)
  };
}

export const PROJECTS_DATA: Record<string, ProjectData> = {
  'slash-ui': {
    id: 'slash-ui',
    name: 'Slash UI',
    description: '',
    logo: '/project/slashui-logo.png',
    heroVideo: '/project/slash-video.mp4',
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
    { name: 'Switzer', sample: 'Aa', image: '/project/font-switzer.png' },
    { name: 'CartographCF', sample: 'Aa', image: '/project/font-cartograph.png' },
    { name: 'Hoshiko-Satsuki', sample: 'Aa', image: '/project/font-hoshiko.png' },
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
  gutter: '20 Gutter',
  columns: '12 Columns',
  margin: '85 Margin',
  maxWidth: '1440 PX',
},
    showcase: {
      mainMedia: {
        type: 'video',
        src: '/project/slash-video.mp4',
      },
      secondaryMedia1: {
        type: 'image',
        src: '/project/slash-img-1.png',
      },
      secondaryMedia2: {
        type: 'image',
        src: '/project/slash-img-2.png',
      },
      sideVisual1: {
        type: 'image',
        src: '/project/slash-img-5.png',
      },
      sideVisual2: {
        type: 'image',
        src: '/project/slash-img-6.png',
      },
      sideVisual3: {
        type: 'image',
        src: '/project/slash-img-7.png',
      },
      researchMedia: {
        type: 'image',
        src: '/project/slash-img-3.png',
      },
    },
  },
};
