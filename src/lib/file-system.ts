
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
      content: `Welcome to ASRWorkspace!\nThis is my portfolio website\nType 'help' for a list of commands.\nIf you are more comfortable with GUI, then switch to GUI by typing cmd : 'gui'`,
    },
    {
      type: 'file',
      name: 'about_me.txt',
      content: `Myself Aditya, I would define myself as a quick learner and a person who is eager to explore new technologies and environments, passionate for innovative solutions and programming. I embrace challenges as opportunities for growth, constantly seeking to expand my knowledge and skill set. I am ready to contribute with my adaptable nature and enthusiasm to any project or team.`,
    },
    {
      type: 'file',
      name: 'education.txt',
      content: `EDUCATION
Dr.D.Y.Patil Institute of Technology, Pimpri, Pune
  Bachelor of Engineering - BE, Computer Engineering
  Dec, 2021 – Dec, 2025
  CGPA: 8.7/10
`,
    },
    {
      type: 'file',
      name: 'experience.txt',
      content: `Software Engineer Intern - TechSolutions Inc. (Summer 2024)
  - Contributed to the development of a blockchain-based supply chain tracking system.
  - Assisted in writing and testing smart contracts in Solidity.
  - Participated in daily scrums and sprint planning.
`,
    },
    {
      type: 'file',
      name: 'achievements.txt',
      content: `(Placeholder for achievements)
- Dean's List - Fall 2023, Spring 2024
- Winner, University Hackathon 2023 (Blockchain Track)
- Certified Ethereum Developer (Placeholder Certification Body)
`,
    },
    {
      type: 'file',
      name: 'resume.pdf',
      url: '/resume.pdf', // Assumes resume.pdf is in public folder
      mimeType: 'application/pdf',
    },
    {
      type: 'file',
      name: 'resume.txt',
      content: `Alex Johnson
alex.johnson@email.com | 555-123-4567 | linkedin.com/in/alexjohnson | github.com/alexjohnson

Education:
Innovate University - B.S. Computer Science (Expected: May 2025)
  - Relevant Coursework: Data Structures, Algorithms, Operating Systems, Database Management, Blockchain Fundamentals, Network Security.

Skills:
- Programming: Python, JavaScript, Java, C++, Solidity
- Blockchain: Ethereum, Smart Contracts, Web3.js, Ethers.js, Hardhat, Truffle, IPFS
- Web Dev: React, Next.js, Node.js, HTML, CSS, Tailwind CSS
- Databases: SQL (PostgreSQL), MongoDB
- Tools: Git, Docker, Kubernetes (Basic), Linux, AWS (EC2, S3)
- Other: Agile/Scrum, Problem Solving, Communication

Projects:
1. Decentralized Identity Management (Ethereum)
   - Developed smart contracts allowing users to control their digital identity.
   - Built a React frontend for users to manage their identity attributes.
   - Tech: Solidity, Hardhat, Ethers.js, React, IPFS for storing claims.

2. NFT Marketplace (Polygon)
   - Created a simple NFT marketplace for minting and trading digital art.
   - Implemented ERC721 token standard and auction functionalities.
   - Tech: Solidity, OpenZeppelin, Next.js, Pinata (for IPFS).

3. ASRWorkspace Portfolio (This Website)
   - Designed and developed an interactive terminal-based portfolio.
   - Tech: Next.js, React, TypeScript.

Experience:
Software Engineer Intern - TechSolutions Inc. (Summer 2024)
  - Contributed to the development of a blockchain-based supply chain tracking system.
  - Assisted in writing and testing smart contracts in Solidity.
  - Participated in daily scrums and sprint planning.
`,
    },
    {
      type: 'directory',
      name: 'projects',
      children: [
        {
          type: 'file',
          name: 'decentralized_identity.txt',
          content: `Project Name: Decentralized Identity Management
Description: A platform built on Ethereum allowing users to own and control their digital identity.
             It aims to provide a secure and user-centric alternative to traditional identity systems.
Technologies: Solidity, Hardhat, Ethers.js, React, IPFS
Role: Lead Developer
Key Features:
  - Smart contracts for identity creation and attribute management.
  - Verifiable credentials stored on IPFS.
  - User-friendly React interface for interaction.
Status: MVP Completed
GitHub: github.com/alexjohnson/decentralized-id (Placeholder)
`,
        },
        {
          type: 'file',
          name: 'nft_marketplace.txt',
          content: `Project Name: NFT Marketplace (Polygon)
Description: A simple marketplace for minting, buying, and selling Non-Fungible Tokens (NFTs) on the Polygon network.
             Focused on low transaction fees and a smooth user experience.
Technologies: Solidity, OpenZeppelin Contracts, Next.js, Ethers.js, Pinata (IPFS)
Role: Full-Stack Developer
Key Features:
  - ERC721 token minting.
  - Fixed-price sales and basic auction mechanism.
  - Browsing and filtering NFTs.
Status: In Development
`,
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
      content: `Programming Languages:
- Python (Advanced), JavaScript (Node.js, React, Next.js - Advanced)
- Java (Intermediate), C++ (Intermediate), Solidity (Advanced), Rust (Beginner)

Blockchain Technologies:
- Ethereum, Polygon, Bitcoin (Conceptual Understanding)
- Smart Contracts: Solidity, OpenZeppelin, ERC20, ERC721, ERC1155
- Development Tools: Hardhat, Truffle, Ganache, Remix IDE
- Libraries: Web3.js, Ethers.js
- Concepts: DLT, Consensus Algorithms (PoW, PoS), Cryptography, Oracles (Chainlink), Layer 2 Scaling, DAOs, DeFi, NFTs, IPFS

Web Development:
- Frontend: React, Next.js, HTML5, CSS3, TailwindCSS
- Backend: Node.js, Express.js
- APIs: RESTful APIs, GraphQL (Basic)

Databases:
- SQL: PostgreSQL, MySQL
- NoSQL: MongoDB

DevOps & Tools:
- Git, GitHub, GitLab
- Docker, Kubernetes (Basic understanding)
- CI/CD (GitHub Actions - Basic)
- Cloud: AWS (EC2, S3, Lambda - Basic), Firebase
- Operating Systems: Linux (Ubuntu), macOS, Windows

Soft Skills:
- Problem Solving, Analytical Thinking, Team Collaboration, Communication
- Agile/Scrum methodologies
`,
    },
    {
      type: 'file',
      name: 'contacts.txt',
      content: `Email: alex.johnson.portfolio@example.com (Placeholder)
LinkedIn: linkedin.com/in/alexjohnsonportfolio (Placeholder)
GitHub: github.com/alexjohnsonportfolio (Placeholder)
`,
    },
  ],
};

export function findNode(path: string, root: Directory = fileSystem): FileSystemNode | undefined {
  if (path === '/' || path === '~' || path === '') {
    return root;
  }

  // Normalize path: remove leading/trailing slashes, handle '~'
  const normalizedPath = path.startsWith('~/') ? path.substring(2) : path.startsWith('/') ? path.substring(1) : path;
  const parts = normalizedPath.split('/').filter(p => p !== '');

  let currentNode: FileSystemNode = root;

  for (const part of parts) {
    if (currentNode.type === 'directory') {
      const found = currentNode.children.find(child => child.name === part);
      if (found) {
        currentNode = found;
      } else {
        return undefined; // Part not found
      }
    } else {
      return undefined; // Trying to navigate into a file
    }
  }
  return currentNode;
}

// Helper function to get content of a file, typically from the root directory
export function getRootFileContent(fileName: string): string | undefined {
  const node = findNode(`~/${fileName}`); // Ensure we are looking in the root
  if (node && node.type === 'file' && node.content) {
    return node.content;
  }
  if (node && node.type === 'file' && !node.content) {
    return `Error: ${fileName} is not a text file or is empty.`;
  }
  return `Error: File '${fileName}' not found.`;
}
