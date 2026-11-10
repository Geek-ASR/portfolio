# ASRWorkspace - Aditya Rekhe's Portfolio

An interactive portfolio with two faces on a single page:

- **Terminal** - the first screen is a working terminal with a virtual file system. Type commands, or simply click / tap any command you see: it is typed into the prompt and run for you.
- **GUI** - scroll down (or run `gui`) for a regular portfolio page with About, Experience, Projects, Research, Certifications, Skills, Education, Achievements and Contact sections.

**Live:** https://geek-asr.github.io/portfolio/

## Terminal commands

| Command | Description |
| --- | --- |
| `help` | Show the list of commands |
| `about_me`, `education`, `skills`, `experience` | About me, education, skills and work experience |
| `projects`, `research`, `certifications`, `achievements` | Projects, research paper, certifications and achievements |
| `contacts` | Contact information |
| `ls [dir]`, `cd [dir]`, `cat [file]`, `open [file]` | Browse the virtual file system |
| `export` | Download the resume |
| `gui` | Switch to GUI mode |
| `whoami`, `date`, `echo [text]`, `clear` | The usual suspects |

Keyboard extras: `Tab` completes commands and file names, `↑` / `↓` walk through command history, `Ctrl + L` clears the screen.

## Editing the content

Everything shown on the site lives in one file: [`src/lib/portfolio-data.ts`](src/lib/portfolio-data.ts). The terminal's files and the GUI sections are both generated from it, so a change there updates both views.

- Resume PDF: `public/resume.pdf`
- Profile photo: `src/assets/profile.jpeg`

## Development

```bash
npm install
npm run dev
```

The site runs at http://localhost:9002.

## Deployment (GitHub Pages)

```bash
npm run build:pages
```

This writes a static site to `./out`, built to be served from `/portfolio`. Set `PAGES_BASE_PATH` to change the path (use an empty value for a custom domain).

Every push to `master` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes it to the `gh-pages` branch served by GitHub Pages.

## Tech stack

Next.js (App Router, static export) · React · TypeScript · Tailwind CSS · ShadCN UI · Framer Motion

## Author

Aditya Rekhe - [GitHub](https://github.com/Geek-ASR) · [LinkedIn](https://www.linkedin.com/in/aditya-rekhe-94b27122a/)
