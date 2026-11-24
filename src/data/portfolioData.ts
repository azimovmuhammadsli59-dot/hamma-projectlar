export interface SkillItem {
  id: string;
  index: string;
  name: string;
  category: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  displayLabel: string;
  url: string;
  domainLabel: string;
  previewImage: string;
  description: string;
}

export const DEVELOPER_PROFILE = {
  brand: 'MUHAMMADALI.DEV',
  name: 'Azimov Muhammadali',
  roleLine: 'Full-Stack Developer | Frontend Developer | Backend Developer',
  heroTitle: 'FULL-STACK DEVELOPER',
  tagline: 'Turning ideas into powerful digital experiences.',
  aboutText:
    "I'm Azimov Muhammadali, a passionate Full-Stack Developer specializing in building modern, responsive, and interactive web applications. I enjoy combining creative design with powerful functionality to create exceptional digital experiences.",
  footerQuote: 'Building the future, one line of code at a time.',
  email: 'azimovmuhammadsli59@gmail.com',
  copyright: '© 2026 Azimov Muhammadali. All Rights Reserved.',
};

export const SKILLS: SkillItem[] = [
  {
    id: 'html5',
    index: '01',
    name: 'HTML5',
    category: 'Semantic Markup',
    description:
      'Accessible, standards-compliant document architecture engineered for SEO, clarity, and fast initial rendering.',
  },
  {
    id: 'css3',
    index: '02',
    name: 'CSS3',
    category: 'Visual Systems',
    description:
      'Precision layout engineering with Grid, Flexbox, fluid typography, and hardware-accelerated keyframe motion.',
  },
  {
    id: 'scss',
    index: '03',
    name: 'SCSS',
    category: 'Modular Styling',
    description:
      'Scalable stylesheet architecture built with mixins, design tokens, and maintainable nested component modules.',
  },
  {
    id: 'javascript',
    index: '04',
    name: 'JavaScript',
    category: 'Core Interactivity',
    description:
      'Clean asynchronous logic, DOM orchestration, and interactive browser engineering across modern web platforms.',
  },
  {
    id: 'php',
    index: '05',
    name: 'PHP',
    category: 'Backend Engineering',
    description:
      'Reliable server-side request handling, structured business logic, and resilient backend application workflows.',
  },
  {
    id: 'reactjs',
    index: '06',
    name: 'React.js',
    category: 'Component Interfaces',
    description:
      'Modular, state-driven user interfaces with reusable hooks, responsive views, and fluid interactive transitions.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'chess-website',
    number: '01',
    title: 'CHESS WEBSITE',
    displayLabel: 'PROJECT 01 — CHESS WEBSITE',
    url: 'https://shaxmat-zor.netlify.app/',
    domainLabel: 'shaxmat-zor.netlify.app',
    previewImage: '/src/assets/images/project_chess_preview_1795503016001.jpg',
    description:
      'A dedicated chess web experience featuring focused board presentation, clean navigation, and responsive layout across devices.',
  },
  {
    id: 'my-search',
    number: '02',
    title: 'MY SEARCH',
    displayLabel: 'PROJECT 02 — MY SEARCH',
    url: 'https://my-search-zor.netlify.app/',
    domainLabel: 'my-search-zor.netlify.app',
    previewImage: '/src/assets/images/project_search_preview_1795503015067.jpg',
    description:
      'A streamlined search web application designed around speed, uncluttered visual hierarchy, and intuitive query discovery.',
  },
  {
    id: 'azimov-gaming',
    number: '03',
    title: 'AZIMOV GAMING',
    displayLabel: 'PROJECT 03 — AZIMOV GAMING',
    url: 'https://azimovgaming-wb8f.netlify.app/',
    domainLabel: 'azimovgaming-wb8f.netlify.app',
    previewImage: '/src/assets/images/project_gaming_preview_1795503015797.jpg',
    description:
      'An interactive gaming showcase website crafted with bold visual contrast, dynamic presentation, and modern frontend polish.',
  },
  {
    id: 'musical-moxie',
    number: '04',
    title: 'MUSICAL MOXIE',
    displayLabel: 'PROJECT 04 — MUSICAL MOXIE',
    url: 'https://musical-moxie-f8879f.netlify.app/',
    domainLabel: 'musical-moxie-f8879f.netlify.app',
    previewImage: '/src/assets/images/project_music_preview_1795503016201.jpg',
    description:
      'A music-centered web project blending expressive editorial rhythm with responsive design and smooth interactive browsing.',
  },
];
