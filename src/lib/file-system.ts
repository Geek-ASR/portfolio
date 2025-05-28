
export interface File {
  type: 'file';
  name: string;
  content?: string; // For text files
  url?: string; // For PDFs or other downloadable files
  mimeType?: string; // e.g., 'application/pdf'
}

export interface Directory {
  type: 'directory';
  name: string;
  children: (File | Directory)[];
}

export type FileSystemNode = File | Directory;

export const fileSystem: Directory = {
  type: 'directory',
  name: '~',
  children: [
    {
      type: 'file',
      name: 'README.md',
      content: `Weelcome to ASR_Workspace\nThis is my portfolio website\nType 'help' for a list of commands.\nIf you are more comfortable with GUI, then switch to GUI by typing cmd : 'gui'`,
    },
    {
      type: 'file',
      name: 'about_me.txt',
      content: `Myself Aditya, I would define myself as a quick learner and a person who is eager to explore new technologies and environments, passionate for innovative solutions and programming. I embrace challenges as opportunities for growth, constantly seeking to expand skill set. I am ready to contribute with my adaptable nature and enthusiasm to any project or team.`,
    },
    {
      type: 'file',
      name: 'education.txt',
      content: `Edducation
 Dr.D.Y.Patil Institute of Technology, Pimpri, Pune
 Bachelor of Engineering - BE, Computer Engineering
 Dec, 2021 – Dec, 2025
 CGPA: 8.7/10
`,
    },
    {
      type: 'file',
      name: 'experience.txt',
      content: `Exxperience
  Association of Computer Engineering Students, DIT
    Aug, 2022 - Jul, 2023
    Jr. Event Manager @ ACES
    Led as Event Manager for the college club, ACES, orchestrating successful and 
    engaging events that enhanced the campus community. Leveraged strong 
    organizational skills to plan and execute a diverse range of activities, 
    fostering team collaboration and ensuring seamless coordination.

  Google Developer Groups, DIT
    Sept, 2023 - current
    Blockchain Co-lead
    Conducted multiple blockchain workshops and sessions, driving hands-on learning 
    and developer engagement.
`,
    },
    {
      type: 'file',
      name: 'achievements.txt',
      content: `Acchievements
  -Won 3rd price in blockchain hackathon held by All India Blockchain Alliance.
  -Got selected and participated in Unfold@2023 hackathon.
  -Conducted workshops on blockchain technology in multiple Universities over time.
`,
    },
    {
      type: 'file',
      name: 'resume.pdf',
      url: '/resume.pdf', 
      mimeType: 'application/pdf',
    },
    {
      type: 'file',
      name: 'resume.txt',
      content: `Aditya Rekhe
8446586979 · adityarekhe1030@gmail.com
LinkedIn: https://www.linkedin.com/in/aditya-rekhe-94b27122a/
GitHub: https://github.com/Geek-ASR
GeeksforGeeks: https://www.geeksforgeeks.org/user/adityare545t/
Location: Pune, Maharashtra

Edducation
  Dr.D.Y.Patil Institute of Technology, Pimpri, Pune
    Bachelor of Engineering - BE, Computer Engineering
    Dec, 2021 – Dec, 2025
    CGPA: 8.7/10

SKILLS
  Programming Languages:
    - Python (Advanced)
    - JavaScript (Advanced)
    - TypeScript (Advanced)
    - Java (Intermediate)
    - C++ (Intermediate)
    - Solidity (Advanced)
    - Rust (Beginner)
  Web Development:
    - React (Advanced)
    - Next.js (Advanced)
    - HTML5 (Advanced)
    - CSS3 (Advanced)
    - TailwindCSS (Advanced)
    - Node.js (Advanced)
    - Express.js (Advanced)
    - GraphQL (Basic)
  Blockchain Technologies:
    - Ethereum
    - Polygon
    - Bitcoin (Conceptual Understanding)
    - Smart Contracts (Solidity)
    - OpenZeppelin
    - ERC20
    - ERC721
    - ERC1155
    - Development Tools (Hardhat, Truffle, Ganache, Remix IDE)
    - Libraries (Web3.js, Ethers.js)
    - Concepts (DLT, Consensus Algorithms (PoW, PoS), Cryptography)
    - Oracles (Chainlink)
    - Layer 2 Scaling
    - DAOs
    - DeFi
    - NFTs
    - IPFS
  Databases:
    - PostgreSQL (SQL)
    - MySQL (SQL)
    - MongoDB (NoSQL)
  DevOps & Tools:
    - Git
    - GitHub
    - GitLab
    - Docker
    - Kubernetes (Basic understanding)
    - CI/CD (GitHub Actions - Basic)
    - AWS (EC2, S3, Lambda - Basic)
    - Firebase
    - Operating Systems (Linux (Ubuntu), macOS, Windows)

Exxperience
  Association of Computer Engineering Students, DIT
    Aug, 2022 - Jul, 2023
    Jr. Event Manager @ ACES
    Led as Event Manager for the college club, ACES, orchestrating successful and 
    engaging events that enhanced the campus community. Leveraged strong 
    organizational skills to plan and execute a diverse range of activities, 
    fostering team collaboration and ensuring seamless coordination.

  Google Developer Groups, DIT
    Sept, 2023 - current
    Blockchain Co-lead
    Conducted multiple blockchain workshops and sessions, driving hands-on learning 
    and developer engagement.

PROJECTS
  VedKarn - Mentorship Platform
    - Responsive, full-stack web application connecting mentees with mentors for career and university admissions support.
    - Tech: Next.js, React, TypeScript, ShadCN UI, Tailwind CSS.
  VisART - DSA Visualisation platform
    - Website for teaching DSA with visualisations, theory, videos, quizzes, and an in-built compiler.
    - Tech: React, JavaScript, HTML, CSS.
  ConnectWell - Health Community Platform
    - Platform for supportive online communities based on medical conditions, with profiles, posts, and comments.
    - Tech: Next.js, React, Firebase, Tailwind CSS.
  ASRWorkspace Portfolio (This Website)
    - Designed and developed an interactive terminal-based portfolio.
    - Tech: Next.js, React, TypeScript.

Acchievements
  -Won 3rd price in blockchain hackathon held by All India Blockchain Alliance.
  -Got selected and participated in Unfold@2023 hackathon.
  -Conducted workshops on blockchain technology in multiple Universities over time.
`,
    },
    {
      type: 'directory',
      name: 'projects',
      children: [
        {
          type: 'file',
          name: 'vedkarn_mentorship.txt',
          content: `Domain: Mentorship Platform
Description: VedKarn is a responsive, full-stack web application developed to connect individuals seeking guidance (mentees) with experienced professionals and alumni (mentors) for both career development and university admissions support.
Tech Stack: Next.js, React, TypeScript, ShadCN UI, Tailwind CSS, Firebase
GitHub: https://github.com/Geek-ASR/VedKarn-Mentorship-Platform
Website: https://vedkarn.vercel.app/
Gallery:
- /screenshots/vedkarn/ss1.png
- /screenshots/vedkarn/ss2.png`,
        },
        {
          type: 'file',
          name: 'visart_dsa.txt',
          content: `Domain: DSA Visualisation Platform
Description: It is a website designed to teach DSA in a simpler and more engaging way by using visualisation of data structures on random or manual inputs. It also consists of theory, applications, YouTube videos and quizzes for each data structure. VisART has an in-built compiler which can be used to practice the questions.
Tech Stack: React, JavaScript, HTML, CSS, Algorithms
GitHub: https://github.com/Geek-ASR/VisART-DSA-Visualisation
Website: #
Gallery:
- /screenshots/visart/ss1.png`,
        },
        {
          type: 'file',
          name: 'connectwell_health.txt',
          content: `Domain: Health Community Platform
Description: ConnectWell is designed to foster supportive online communities for individuals sharing similar medical conditions. The platform enables users to create personalised profiles, discover, join, and create interest-based communities, and engage in discussions through posts and comments.
Tech Stack: Next.js, React, Firebase, Tailwind CSS, ShadCN UI
GitHub: https://github.com/Geek-ASR/ConnectWell
Website: #
Gallery:
- /screenshots/connectwell/ss1.png`,
        },
        {
            type: 'file',
            name: 'project_details.pdf',
            url: '/blockchain_project_details.pdf', 
            mimeType: 'application/pdf',
        }
      ],
    },
    {
      type: 'file',
      name: 'skills.txt',
      content: `SKILLS
Programming Languages:
  - Python (Advanced)
  - JavaScript (Advanced)
  - TypeScript (Advanced)
  - Java (Intermediate)
  - C++ (Intermediate)
  - Solidity (Advanced)
  - Rust (Beginner)
Web Development:
  - React (Advanced)
  - Next.js (Advanced)
  - HTML5 (Advanced)
  - CSS3 (Advanced)
  - TailwindCSS (Advanced)
  - Node.js (Advanced)
  - Express.js (Advanced)
  - GraphQL (Basic)
Blockchain Technologies:
  - Ethereum
  - Polygon
  - Bitcoin (Conceptual Understanding)
  - Smart Contracts (Solidity)
  - OpenZeppelin
  - ERC20
  - ERC721
  - ERC1155
  - Development Tools (Hardhat, Truffle, Ganache, Remix IDE)
  - Libraries (Web3.js, Ethers.js)
  - Concepts (DLT, Consensus Algorithms (PoW, PoS), Cryptography)
  - Oracles (Chainlink)
  - Layer 2 Scaling
  - DAOs
  - DeFi
  - NFTs
  - IPFS
Databases:
  - PostgreSQL (SQL)
  - MySQL (SQL)
  - MongoDB (NoSQL)
DevOps & Tools:
  - Git
  - GitHub
  - GitLab
  - Docker
  - Kubernetes (Basic understanding)
  - CI/CD (GitHub Actions - Basic)
  - AWS (EC2, S3, Lambda - Basic)
  - Firebase
  - Operating Systems (Linux (Ubuntu), macOS, Windows)
`,
    },
    {
      type: 'file',
      name: 'contacts.txt',
      content: `Coontact Info: 
8446586979 · adityarekhe1030@gmail.com
LinkedIn: https://www.linkedin.com/in/aditya-rekhe-94b27122a/
GFG: https://www.geeksforgeeks.org/user/adityare545t/
GitHub: https://github.com/Geek-ASR
Location: Pune, Maharashtra
`,
    },
  ],
};

export function findNode(path: string, root: Directory = fileSystem): FileSystemNode | undefined {
  if (path === '/' || path === '~' || path === '') {
    return root;
  }

  const normalizedPath = path.startsWith('~/') ? path.substring(2) : path.startsWith('/') ? path.substring(1) : path.startsWith('./') ? path.substring(2) : path;
  const parts = normalizedPath.split('/').filter(p => p !== '');

  let currentNode: FileSystemNode = root;

  for (const part of parts) {
    if (currentNode.type === 'directory') {
      const found = currentNode.children.find(child => child.name === part);
      if (found) {
        currentNode = found;
      } else {
        return undefined; 
      }
    } else {
      return undefined; 
    }
  }
  return currentNode;
}

export function getRootFileContent(fileName: string): string | undefined {
  const node = findNode(`~/${fileName}`); 
  if (node && node.type === 'file' && node.content) {
    return node.content;
  }
  if (node && node.type === 'file' && !node.content) {
    return `Error: ${fileName} is not a text file or is empty.`;
  }
  return `Error: File '${fileName}' not found.`;
}
