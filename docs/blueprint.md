# **App Name**: BlockTerminal

## Core Features:

- Terminal Interface: Simulate a terminal interface for navigating the portfolio.
- File System Navigation: Display a navigable file system within the terminal, mimicking standard directory structures.
- File Viewing Commands: Implement commands for viewing text files and opening PDF documents directly within the terminal interface. Utilize helper functions for secure pdf rendering.
- Auto Export: Automatically generate an updated and stylistically-consistent PDF of the information found on the website (resume, projects, etc), when the 'export' command is run.
- AI Resume Enhancement: Use an AI "tool" to review the resume and provide suggestions for improvement based on the content and target roles.

## Style Guidelines:

- Background color: Dark charcoal grey (#222222) to emulate a classic terminal.
- Primary color: Soft grey (#A8A8A8) for text, providing good readability against the dark background. Not pure white to avoid excessive contrast.
- Accent color: Pale green (#90EE90) to highlight commands and interactive elements, drawing from traditional terminal aesthetics.  The goal here is to create an analogous pallette around green, but not using that directly.
- Monospace font to enhance the terminal-like appearance.
- Screen layout: A single, full-screen terminal window to remove distraction. Clear sections divide the screen (if needed) for directory structure, command input, and output.
- Typing animation for command output to mimic real-time terminal feedback. Smooth transitions for directory navigation.