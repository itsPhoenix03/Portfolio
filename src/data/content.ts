export interface Skill {
  name: string;
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  grade: string;
  coursework: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  current?: boolean;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  highlights?: string[];
  link?: string;
  linkLabel?: string;
  /** Short monogram shown on the project cover (defaults to initials). */
  cover?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  credentialUrl?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface SiteMeta {
  name: string;
  title: string;
  description: string;
  role: string;
  objective: string;
  email: string;
  location: string;
  timezone: string;
  currently: string;
  careerStart: string;
}

export const siteMeta: SiteMeta = {
  name: 'Shreyas Misra',
  title: 'Shreyas Misra — Software Engineer',
  description: 'Portfolio of Shreyas Misra — Software Engineer specializing in scalable, dependable systems.',
  role: 'Software Engineer',
  objective: 'Becoming a High Value Agency and delivering Scalable and Dependable Systems which help Organizations Grow and have Success.',
  email: 'shreyas.misra03@gmail.com',
  location: 'India',
  timezone: 'Asia/Kolkata',
  currently: 'SDE-1 at Meril (Nuvo AI) — R&D, IIT Kanpur Technopark',
  careerStart: '2024-05-01',
};

// Contact form → Web3Forms, which emails submissions to the inbox tied to this
// access key. The key is designed to be public (it only allows sending to that
// inbox), so it's fine in client-side code.
export const contactForm = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: 'c8fc02b9-5b6e-40ed-a0fc-4058b42cb37a',
};

// Words that run across the crossing marquee "tapes".
export const marqueeWords: string[] = [
  'Software Engineer',
  'Full-Stack',
  'AI-Integrated Systems',
  'Scalable',
  'Dependable',
  'TypeScript',
  'Next.js',
  'Node.js',
  'Golang',
];

export const education: Education[] = [
  {
    degree: 'Master of Computer Applications',
    institution: 'Pondicherry University',
    period: '2022 – 2024',
    grade: '9.2 CGPA (3.65 GPA)',
    coursework: 'Web Development, Machine Learning, Networking, Management Principles',
  },
  {
    degree: 'Bachelor of Computer Applications',
    institution: 'University of Lucknow',
    period: '2019 – 2022',
    grade: '77.3% (3.1 GPA)',
    coursework: 'Database Management Systems, Software Engineering Principles, Data Mining',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'Programming Languages',
    items: [
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Golang' },
      { name: 'C++' },
      { name: 'Python' },
    ],
  },
  {
    category: 'Frontend & Frameworks',
    items: [
      { name: 'Next.js' },
      { name: 'React.js' },
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'Redux' },
      { name: 'Zustand' },
      { name: 'Tailwind CSS' },
      { name: 'CSS' },
      { name: 'HTML' },
    ],
  },
  {
    category: 'Backend & Databases',
    items: [
      { name: 'MongoDB' },
      { name: 'MySQL' },
      { name: 'Firebase' },
      { name: 'Prisma' },
      { name: 'Mongoose' },
      { name: 'JWT' },
      { name: 'OAuth Integration' },
      { name: 'WebSockets' },
      { name: 'Redis' },
    ],
  },
  {
    category: 'Tools & Platforms',
    items: [
      { name: 'Git & GitHub' },
      { name: 'Postman' },
      { name: 'Webpack' },
      { name: 'Vite' },
      { name: 'NPM' },
      { name: 'Claude Code' },
      { name: 'AWS' },
    ],
  },
  {
    category: 'Soft Skills',
    items: [
      { name: 'Active Listener' },
      { name: 'Collaborative' },
      { name: 'Supportive' },
      { name: 'Team Player' },
      { name: 'Creative Thinker' },
      { name: 'Communication' },
    ],
  },
];

export const experience: Experience[] = [
  {
    role: 'SDE-1 (Full Stack Developer)',
    company: 'Meril (Nuvo AI Pvt. Ltd.)',
    location: 'Kanpur, UP',
    period: 'May 2026 – Present',
    current: true,
    bullets: [
      'Working at the Research and Development Department located at the IIT Kanpur Technopark.',
      'Building application which integrate modern custom fine tuned AI models to help in improving the time consumed in the medical processes and regulatory compliance processes.',
      'Designing solution which can scale to thousands of people while also being reliable.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Laitkor Consultancy Services Pvt. Ltd. & Laitkor Labs',
    location: 'Lucknow, UP',
    period: 'May 2024 – May 2026',
    bullets: [
      'Built and maintained scalable full-stack applications with React.js, Next.js, and Node.',
      'Collaborated on RESTful API design and code reviews, boosting integration efficiency and code reliability.',
      'Showcased adaptability by quickly adapting and delivering solutions across different languages and domains like PHP, N8n, Power Automate, SharePoint, and Power Apps.',
    ],
  },
];

export const projects: Project[] = [
  {
    title: 'Stanley AI',
    cover: 'SA',
    description:
      'Regulatory intelligence for medical devices — a documentation workspace for EU MDR, US FDA and CDSCO submissions that generates design inputs, GSPR coverage and audit-ready dossiers in a single session-aware platform.',
    tags: ['React', 'Generative AI', 'Regulatory Tech', 'AWS'],
    highlights: [
      'Generates design inputs and GSPR coverage for medical devices',
      'Audit-ready dossiers for EU MDR, US FDA and CDSCO submissions',
      'Session-aware workspace built in R&D at Meril (Nuvo AI)',
    ],
    link: 'https://stanleyai.nuvobuddy.com/',
    linkLabel: 'Visit Stanley',
  },
  {
    title: 'Echoes of the Hearth',
    cover: 'EH',
    description:
      'A web-based 2D isometric co-op survival RPG — gather, craft, build and defend together across four biomes, with real-time multiplayer powered by a Go WebSocket server.',
    tags: ['Golang', 'WebSockets', 'TypeScript', 'Vite'],
    highlights: [
      'Real-time co-op multiplayer over a Go WebSocket server',
      'Four biomes with dynamic weather, elevation and fall damage',
      'Crafting, base building, wildlife and escalating monster waves',
      'Persistent 1280×1280 world across sessions',
    ],
    link: 'https://github.com/itsPhoenix03/echoes-of-the-hearth',
    linkLabel: 'View code',
  },
  {
    title: 'Social Scoop',
    description: 'Built Social Scoop to curate trending content, featuring a RESTful API and responsive UI for seamless user experience.',
    tags: ['React.js', 'Node.js', 'REST API', 'MongoDB'],
    highlights: [
      'RESTful API serving curated, trending content',
      'Responsive UI focused on a seamless reading experience',
      'MongoDB-backed data layer',
    ],
    link: 'https://social-scoop.netlify.app/',
    linkLabel: 'Try it here',
  },
  {
    title: 'University NSS Portal',
    description: "Developed Pondicherry University's NSS Portal for volunteer registration and event management with an admin dashboard, improving operational efficiency.",
    tags: ['Next.js', 'Node.js', 'MongoDB', 'Dashboard'],
    highlights: [
      'Volunteer registration & event management',
      'Admin dashboard for day-to-day operations',
      'Improved operational efficiency for the university',
    ],
    link: 'https://pondicherryuniversitynss.netlify.app/',
    linkLabel: 'Explore',
  },
];

// "Team radio" lines surfaced by the hidden easter eggs (see EasterEggs.astro).
export interface RadioQuote {
  text: string;
  by: string;
}

export const radioQuotes: RadioQuote[] = [
  { text: 'Simply lovely.', by: 'Max Verstappen' },
  { text: 'If you no longer go for a gap that exists, you are no longer a racing driver.', by: 'Ayrton Senna' },
  { text: "If everything seems under control, you're not going fast enough.", by: 'Mario Andretti' },
  { text: 'If in doubt, flat out.', by: 'Colin McRae' },
  { text: "Leave me alone, I know what I'm doing.", by: 'Kimi Räikkönen' },
  { text: 'Riding a race bike is an art — a thing you do because you feel something inside.', by: 'Valentino Rossi' },
  { text: 'To finish first, first you have to finish.', by: 'Racing proverb' },
  { text: 'Lights out and away we go.', by: 'Race start' },
];

export const certifications: Certification[] = [
  {
    title: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle',
    credentialUrl:
      'https://catalog-education.oracle.com/pls/certview/sharebadge?id=1CE18B1144244A0784DD34A2CC5AD665B20EC8626FFE4FECD9AD74C8793907A3',
  },
  {
    title: 'Oracle Cloud Infrastructure Certified AI Foundations Associate',
    issuer: 'Oracle',
    credentialUrl:
      'https://catalog-education.oracle.com/pls/certview/sharebadge?id=78B99FA9FA73BE7985D27E768C379C5AC2EACA99786EB98B26C712841722CA36',
  },
  {
    title: 'Integrate Machine Learning APIs on Google Cloud Platform',
    issuer: 'Google Cloud',
    credentialUrl:
      'https://www.cloudskillsboost.google/public_profiles/dd871fbc-1cb8-4367-b71d-d2bcb59b4e4a/badges/1466496',
  },
  {
    title: 'React Training',
    issuer: 'Internshala',
    credentialUrl: 'https://trainings.internshala.com/s/v/139524/7a2f7b9b',
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/itsPhoenix03',
    icon: '/svg/github-brands.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shreyas-misra/',
    icon: '/svg/linkedIn-circle.svg',
  },
  {
    label: 'Email',
    href: 'mailto:shreyas.misra03@gmail.com',
    icon: '/svg/email-svgrepo-com.svg',
  },
];

export const navSections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];
