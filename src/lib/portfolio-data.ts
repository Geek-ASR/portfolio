/**
 * Single source of truth for everything shown on the site.
 * The terminal's virtual file system (src/lib/file-system.ts) and the GUI
 * (src/components/gui/Portfolio.tsx) are both generated from this file, so
 * editing an entry here updates both views.
 */

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefix a file from /public with the deployment base path (e.g. /portfolio on GitHub Pages). */
export const withBase = (path: string) => `${basePath}${path}`;

export const profile = {
  name: 'Aditya Rekhe',
  fullName: 'Aditya Surendra Rekhe',
  workspace: 'ASR_Workspace',
  roles: ['Software Engineer', 'Independent Researcher', 'Blockchain Enthusiast'],
  location: 'Pune, Maharashtra, India',
  email: 'adityarekhe1030@gmail.com',
  phone: '+91 8446586979',
  phoneHref: '+918446586979',
  resumeFile: '/resume.pdf',
  resumeDownloadName: 'Aditya_Rekhe_Resume.pdf',
  summary:
    'Myself Aditya, I would define myself as a quick learner and a person who is eager to explore new technologies and environments, passionate for innovative solutions and programming. I embrace challenges as opportunities for growth, constantly seeking to expand skill set. I am ready to contribute with my adaptable nature and enthusiasm to any project or team.',
  now: 'Currently a Software Engineer at Stratacent Technologies, working across production infrastructure, security operations and GenAI applications. Outside work I build products and do independent research where AI, web development, blockchain and system design meet.',
} as const;

export interface SocialLink {
  name: string;
  label: string;
  url: string;
}

export const socials: SocialLink[] = [
  { name: 'GitHub', label: 'github.com/Geek-ASR', url: 'https://github.com/Geek-ASR' },
  { name: 'LinkedIn', label: 'linkedin.com/in/aditya-rekhe-94b27122a', url: 'https://www.linkedin.com/in/aditya-rekhe-94b27122a/' },
  { name: 'GeeksforGeeks', label: 'geeksforgeeks.org/user/adityare545t', url: 'https://www.geeksforgeeks.org/user/adityare545t/' },
  { name: 'ORCID', label: 'orcid.org/0009-0003-8009-3074', url: 'https://orcid.org/0009-0003-8009-3074' },
];

export interface EducationItem {
  institution: string;
  affiliation?: string;
  url?: string;
  degree: string;
  period: string;
  score: string;
  notes?: string[];
}

export const education: EducationItem[] = [
  {
    institution: 'Dr. D. Y. Patil Institute of Technology, Pimpri, Pune',
    affiliation: 'Savitribai Phule Pune University',
    url: 'https://engg.dypvp.edu.in/',
    degree: 'Bachelor of Engineering - BE, Computer Engineering',
    period: '2021 – 2025',
    score: 'CGPA: 8.68/10',
    notes: ['Honours specialization in Blockchain Technology (20 credits)'],
  },
  {
    institution: 'P.S. Deshmukh English Medium School & Junior College, Shahapur',
    degree: 'Higher Secondary Certificate (HSC) - Maharashtra State Board',
    period: 'May 2021',
    score: 'Score: 89%',
  },
  {
    institution: 'P.S. Deshmukh English Medium School & Junior College, Shahapur',
    degree: 'Secondary School Certificate (SSC) - Maharashtra State Board',
    period: 'March 2019',
    score: 'Score: 85.6%',
  },
];

export interface ExperienceItem {
  org: string;
  role: string;
  period: string;
  location?: string;
  kind: 'work' | 'leadership';
  points: string[];
}

export const experience: ExperienceItem[] = [
  {
    org: 'Stratacent Technologies Pvt. Ltd.',
    role: 'Software Engineer',
    period: 'Sept 2025 – Present',
    location: 'Pune, India',
    kind: 'work',
    points: [
      'Handle incident management across database, cybersecurity and infrastructure domains in production environments.',
      'Perform root cause analysis (RCA) for critical system failures and operational incidents.',
      'Contributed to the development of a GenAI-powered internal chatbot system.',
      'Work with cross-functional teams to improve system reliability, issue resolution and operational workflows.',
      'Gained exposure to production-scale systems, security operations and infrastructure troubleshooting.',
    ],
  },
  {
    org: 'Google Developer Groups (GDG), DIT',
    role: 'Blockchain Lead',
    period: 'Mar 2023 – Feb 2025',
    kind: 'leadership',
    points: [
      'Conducted multiple blockchain workshops and sessions, driving hands-on learning and developer engagement.',
    ],
  },
  {
    org: 'Association of Computer Engineering Students (ACES), DIT',
    role: 'Jr. Event Manager',
    period: 'Aug 2022 – Jul 2023',
    kind: 'leadership',
    points: [
      'Led as Event Manager for the college club, ACES, orchestrating successful and engaging events that enhanced the campus community.',
      'Leveraged strong organizational skills to plan and execute a diverse range of activities, fostering team collaboration and ensuring seamless coordination.',
    ],
  },
];

export interface Project {
  /** File name inside ~/projects in the terminal. */
  file: string;
  name: string;
  domain: string;
  period: string;
  description: string;
  highlights?: string[];
  tech: string[];
  /** Label for the tag list above. Defaults to "Tech Stack". */
  tagLabel?: string;
  github?: string;
  website?: string;
  paper?: string;
  team?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    file: 'truthlens.txt',
    name: 'TruthLens',
    domain: 'AI Fact-Checking Pipeline',
    period: '2026',
    description:
      'An evidence-first pipeline for fact-checking short-form political video and image posts. TruthLens decomposes a post into atomic claims, researches each against the open web, and subjects every generated verdict to a deterministic, non-LLM validator before anything is published.',
    highlights: [
      'Ten-stage pipeline: ingestion (download, transcribe, OCR) → claim extraction → research planning → evidence retrieval → stance analysis → verdict → deterministic validation → aggregation → carousel rendering → human-approved publishing.',
      'Every LLM stage runs on local models by default - no API key and no per-token cost.',
      'Released with a preprint and the 202-item TruthLens-202 evaluation corpus.',
    ],
    tech: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL / pgvector', 'Redis', 'Ollama', 'faster-whisper', 'Docker'],
    github: 'https://github.com/Geek-ASR/truthlens',
    paper: 'https://doi.org/10.5281/zenodo.22758785',
    team: 'Solo',
    featured: true,
  },
  {
    file: 'carecircle.txt',
    name: 'CareCircle',
    domain: 'Chronic-Illness Community Platform',
    period: '2026',
    description:
      'A community platform for people living with chronic illness - every illness, not just one. Members join communities for their conditions, post and comment, ask questions, chat in real time and find people who understand what they are dealing with.',
    highlights: [
      'Community structure, real-time chat and a Q&A format in a single product.',
      'Static frontend on GitHub Pages with the backend entirely on Supabase (Auth, Postgres with row-level security, Realtime, Storage).',
    ],
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Radix UI', 'TanStack Query', 'Zustand', 'Supabase'],
    github: 'https://github.com/Geek-ASR/care-circle',
    website: 'https://geek-asr.github.io/care-circle/',
    featured: true,
  },
  {
    file: 'iti_thane_smart_campus.txt',
    name: 'Govt. ITI (Women), Thane - Website & Smart Campus',
    domain: 'Institute Website & Campus Portal',
    period: '2026',
    description:
      'A bilingual (English + Marathi), mobile-first website and Smart Campus portal for Rajmata Jijau Government Industrial Training Institute (Women), Thane.',
    highlights: [
      'Smart attendance with rotating, HMAC-signed QR codes and location checks.',
      'Online quizzes with per-trainee shuffling, timers, autosave and analytics.',
      'Job & placement portal, website CMS and an installable PWA.',
      'Built to GIGW / WCAG 2.1 AA accessibility guidelines with full static SEO.',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PWA', 'Express', 'PostgreSQL'],
    github: 'https://github.com/Geek-ASR/iti-thane-women',
    website: 'https://geek-asr.github.io/iti-thane-women/',
    featured: true,
  },
  {
    file: 'neuralcraft.txt',
    name: 'NeuralCraft',
    domain: '3D Playground for Learning AI',
    period: '2026',
    description:
      'A free, browser-based 3D playground for learning AI, machine learning and data science through interactive experiments. Walk around a small voxel world, visit different labs, write real code and see the results visually.',
    highlights: [
      '36 lessons - from math and statistics to neural networks, embeddings, attention and reinforcement learning.',
      'Six interactive labs: Gradient Descent, Galton Board, K-Means, Neural Network / MNIST, Embeddings and Q-Learning.',
      'A sandbox for building structures with Blockly, Python or JavaScript. No backend, account or tracking.',
    ],
    tech: ['TypeScript', 'Three.js', 'Vite', 'Blockly', 'CodeMirror 6', 'Pyodide', 'Web Audio API', 'Vitest'],
    github: 'https://github.com/Geek-ASR/Trial-AI_Playground',
    website: 'https://geek-asr.github.io/Trial-AI_Playground/',
    team: 'Solo',
    featured: true,
  },
  {
    file: 'deutschpfad.txt',
    name: 'DeutschPfad',
    domain: 'German-Learning Website',
    period: '2026',
    description:
      'A free German-language learning website for international students - vocabulary, grammar, stories, history, geography and real-life German, built as a static site with zero recurring infrastructure cost.',
    highlights: [
      'No signup, login, payment, backend or database.',
      'Progress is stored only in the learner\'s browser, with export / import to move it between devices.',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Static Site'],
    github: 'https://github.com/Geek-ASR/deutschpfad',
    website: 'https://geek-asr.github.io/deutschpfad/',
    team: 'Solo',
    featured: true,
  },
  {
    file: 'learnit.txt',
    name: 'LearnIt',
    domain: 'AI-Assisted Learning & Engagement Platform',
    period: 'Sept 2024 – Mar 2025',
    description:
      'A MERN-stack educational platform for engineering students that integrates AI-assisted learning support with collaborative learning features. Built as the final-year B.E. project.',
    highlights: [
      'Gemini API-based assistance for interactive doubt solving and personalized learning support.',
      'Real-time one-to-one and group sessions over WebRTC.',
      'Discussion forums, structured courses and "Time Capsules" for focused, time-boxed study batches.',
      'Designed backend APIs, database architecture and modular system workflows.',
    ],
    tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Gemini API', 'WebRTC', 'REST APIs'],
    github: 'https://github.com/KhileshThakur/learnit-frontend',
    team: 'Team of 4',
    featured: true,
  },
  {
    file: 'nyaya.txt',
    name: 'NYAYA',
    domain: 'AI-Powered Legal Awareness & Guidance Platform',
    period: 'Jul 2023 – Oct 2023',
    description:
      'A web and app based legal awareness and guidance platform with an AI chatbot for assistance, decision trees, a marketplace for lawyers, online consultation, digital agreements and more.',
    highlights: ['Led a team of 6 as team lead.'],
    tech: ['AI Chatbot', 'Decision Trees', 'Lawyer Marketplace', 'Online Consultation', 'Digital Agreements'],
    tagLabel: 'Features',
    team: 'Team of 6 · Team Lead',
    featured: true,
  },
  {
    file: 'xproperty.txt',
    name: 'XpropertY',
    domain: 'Decentralized Real Estate Platform',
    period: 'Dec 2023',
    description:
      'A blockchain-based real estate platform where property ownership is represented through NFTs, with smart contract-based transactions and decentralized document storage using IPFS. Built at the Unfold 2023 hackathon.',
    highlights: [
      'Tokenizes real estate assets so they can be listed, bought and sold on a marketplace.',
      'Explored distributed trust, transparency and secure digital ownership.',
    ],
    tech: ['Solidity', 'Hardhat', 'Ethers.js', 'React', 'IPFS', 'NFTs'],
    github: 'https://github.com/Geek-ASR/Unfold23_XpropertY',
    team: 'Team of 4',
    featured: true,
  },
  {
    file: 'mentorship_platform.txt',
    name: 'Mentorship Platform',
    domain: 'Student Mentorship Marketplace',
    period: '2026 · In development',
    description:
      'A student mentorship marketplace for career and study-abroad guidance - a low-cost, trustworthy place where students get practical guidance from people who have already done the thing they are preparing for.',
    highlights: [
      'Free knowledge and live events, affordable group sessions and paid 1-on-1 sessions on one engine.',
      'Designed docs-first: architecture, booking, payments, trust & safety and threat model.',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Drizzle ORM', 'PostgreSQL', 'Tailwind CSS', 'Vitest', 'Playwright'],
    github: 'https://github.com/Geek-ASR/MentorshipPlatform',
  },
  {
    file: 'vedkarn_mentorship.txt',
    name: 'VedKarn',
    domain: 'Mentorship Platform',
    period: '2025',
    description:
      'VedKarn is a responsive, full-stack web application developed to connect individuals seeking guidance (mentees) with experienced professionals and alumni (mentors) for both career development and university admissions support.',
    tech: ['Next.js', 'React', 'TypeScript', 'ShadCN UI', 'Tailwind CSS', 'Firebase'],
    github: 'https://github.com/Geek-ASR/VedKarn',
    website: 'https://vedkarn.vercel.app/',
  },
  {
    file: 'connectwell_health.txt',
    name: 'ConnectWell',
    domain: 'Health Community Platform',
    period: '2025',
    description:
      'ConnectWell is designed to foster supportive online communities for individuals sharing similar medical conditions. The platform enables users to create personalised profiles, discover, join, and create interest-based communities, and engage in discussions through posts and comments.',
    tech: ['Next.js', 'React', 'Firebase', 'Tailwind CSS', 'ShadCN UI'],
    github: 'https://github.com/Geek-ASR/ConnectWell',
  },
  {
    file: 'visart_dsa.txt',
    name: 'VisART',
    domain: 'DSA Visualisation Platform',
    period: 'Apr 2022 – Jan 2023',
    description:
      'A website designed to teach DSA in a simpler and more engaging way by using visualisation of data structures on random or manual inputs. It also consists of theory, applications, YouTube videos and quizzes for each data structure. VisART has an in-built compiler which can be used to practice the questions.',
    tech: ['React', 'JavaScript', 'HTML', 'CSS', 'Algorithms'],
    github: 'https://github.com/Geek-ASR/VisArt',
    team: 'Solo',
  },
  {
    file: 'sit_hackathon.txt',
    name: 'SIT Hackathon - Blockchain Edition',
    domain: 'Smart Contracts',
    period: '2023',
    description:
      'Smart-contract submissions for the SIT Hackathon - Blockchain Edition: a voting system, a supply-chain tracker and a digital-art contract. The submission won third position.',
    tech: ['Solidity', 'Remix IDE', 'Smart Contracts'],
    github: 'https://github.com/Geek-ASR/SIT_Hackathon',
  },
  {
    file: 'asrworkspace_portfolio.txt',
    name: 'ASRWorkspace Portfolio (This Website)',
    domain: 'Terminal + GUI Portfolio',
    period: '2025 – 2026',
    description:
      'Designed and developed an interactive terminal-based portfolio with a GUI mode: a virtual file system, clickable commands and a scroll-down graphical view.',
    tech: ['Next.js', 'React', 'TypeScript', 'ShadCN UI', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/Geek-ASR/portfolio',
  },
];

export interface ResearchPaper {
  title: string;
  authors: string;
  affiliation: string;
  venue: string;
  year: string;
  status: string;
  abstract: string;
  findings: string[];
  keywords: string[];
  doi: string;
  doiUrl: string;
  softwareDoi: string;
  softwareDoiUrl: string;
  codeUrl: string;
  license: string;
  bibtex: string;
}

export const research: ResearchPaper[] = [
  {
    title:
      'TruthLens: A Verification-Gated Pipeline for Evidence-Grounded Fact-Checking of Short-Form Political Video',
    authors: 'Aditya Rekhe',
    affiliation: 'Independent Researcher',
    venue: 'Zenodo',
    year: '2026',
    status: 'Research preprint (not peer reviewed)',
    abstract:
      'TruthLens is an evidence-first pipeline for fact-checking short-form political video and image posts. It decomposes a post into atomic claims, researches each against the open web, and subjects every generated verdict to a deterministic, non-LLM validator before publication. The release includes the preprint, the 202-item TruthLens-202 evaluation corpus (URLs, labels and annotations only), and the supplementary results and protocols needed to reproduce the reported numbers.',
    findings: [
      'A deterministic, non-LLM validator checks that a verdict\'s citations exist, its sources were actually fetched, its numbers are grounded in retrieved evidence and its label does not contradict its own reasoning. A verdict that fails is downgraded, not published.',
      'Results are reported as an honest floor for a deliberately minimal, zero-cost, local-only configuration - not as a headline capability.',
      'Diagnostic finding: claim extraction - not retrieval - gates whether a post gets checked at all.',
    ],
    keywords: [
      'automated fact-checking',
      'misinformation detection',
      'claim extraction',
      'short-form video',
      'retrieval-augmented generation',
      'evaluation benchmark',
      'large language models',
      'computational journalism',
    ],
    doi: '10.5281/zenodo.22758785',
    doiUrl: 'https://doi.org/10.5281/zenodo.22758785',
    softwareDoi: '10.5281/zenodo.22758976',
    softwareDoiUrl: 'https://doi.org/10.5281/zenodo.22758976',
    codeUrl: 'https://github.com/Geek-ASR/truthlens',
    license: 'Paper and dataset: CC BY 4.0 · Code: MIT',
    bibtex: `@misc{rekhe2026truthlens,
  author    = {Rekhe, Aditya},
  title     = {{TruthLens: A Verification-Gated Pipeline for
                Evidence-Grounded Fact-Checking of Short-Form
                Political Video}},
  year      = {2026},
  publisher = {Zenodo},
  version   = {1.0.0},
  doi       = {10.5281/zenodo.22758785},
  url       = {https://doi.org/10.5281/zenodo.22758785}
}`,
  },
];

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  type: 'Course' | 'Internship' | 'Hackathon' | 'Workshop';
  description: string;
}

export const certifications: Certification[] = [
  {
    title: 'Networking Basics',
    issuer: 'Cisco Networking Academy',
    date: 'Nov 2023',
    type: 'Course',
    description:
      'Certificate of Course Completion - network communication, standards and protocols, Ethernet, IPv4 / IPv6 addressing, routing and troubleshooting network connectivity.',
  },
  {
    title: 'Frontend Web Development Internship',
    issuer: 'VirtualIntern',
    date: 'Jan 2024',
    type: 'Internship',
    description:
      'Internship Completion Certificate for the one-month Frontend Web Development program.',
  },
  {
    title: 'DevClash Hackathon',
    issuer: 'DevKraft · Dr. D. Y. Patil Institute of Technology, Pimpri',
    date: 'Feb 2024',
    type: 'Hackathon',
    description:
      'Certificate of Participation for solving real-world tech challenges in the DevClash hackathon.',
  },
  {
    title: 'Blockchain Bootcamp',
    issuer: 'SIT Pune',
    date: 'Jun 2023',
    type: 'Workshop',
    description:
      'Hands-on workshop on blockchain technology, cryptocurrencies, smart contracts, Ethereum, Hyperledger and decentralized application (dApp) architecture.',
  },
];

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: 'Programming Languages',
    items: [
      'Python (Advanced)',
      'JavaScript (Advanced)',
      'TypeScript (Advanced)',
      'Java (Intermediate)',
      'C++ (Intermediate)',
      'Solidity (Advanced)',
      'Rust (Beginner)',
    ],
  },
  {
    category: 'Web Development',
    items: [
      'React (Advanced)',
      'Next.js (Advanced)',
      'HTML5 (Advanced)',
      'CSS3 (Advanced)',
      'TailwindCSS (Advanced)',
      'Node.js (Advanced)',
      'Express.js (Advanced)',
      'REST APIs',
      'FastAPI',
      'WebRTC',
      'GraphQL (Basic)',
    ],
  },
  {
    category: 'Blockchain Technologies',
    items: [
      'Ethereum',
      'Polygon',
      'Bitcoin (Conceptual Understanding)',
      'Smart Contracts (Solidity)',
      'OpenZeppelin',
      'ERC20',
      'ERC721',
      'ERC1155',
      'Development Tools (Hardhat, Truffle, Ganache, Remix IDE)',
      'Libraries (Web3.js, Ethers.js)',
      'Concepts (DLT, Consensus Algorithms (PoW, PoS), Cryptography)',
      'Oracles (Chainlink)',
      'Layer 2 Scaling',
      'DAOs',
      'DeFi',
      'NFTs',
      'IPFS',
    ],
  },
  {
    category: 'DevOps & Tools',
    items: [
      'Git',
      'GitHub',
      'GitLab',
      'Docker',
      'Kubernetes (Basic understanding)',
      'CI/CD (GitHub Actions - Basic)',
      'AWS (EC2, S3, Lambda - Basic)',
      'Firebase',
      'Operating Systems (Linux (Ubuntu), macOS, Windows)',
      'VS Code',
      'Figma',
      'Canva',
    ],
  },
  {
    category: 'AI & GenAI',
    items: ['LangChain', 'Gemini API', 'Retrieval-Augmented Generation', 'Local LLMs (Ollama)'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL (SQL)', 'MySQL (SQL)', 'MongoDB (NoSQL)', 'Supabase'],
  },
];

export const achievements: string[] = [
  'Won 3rd prize in the inter-college blockchain hackathon held by All India Blockchain Alliance (Sept 2023).',
  'Got selected and participated in Unfold@2023 hackathon (Dec 2023).',
  'Completed a 20-credit Honours specialization in Blockchain Technology.',
  'Conducted workshops on blockchain technology and dApps in multiple universities as a guest lecturer.',
];
