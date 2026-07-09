export const portfolioData = {
  personal: {
    name: 'Ahmad Maruf Hossain',
    gamertag: 'spicyfalcon619',
    tagline: 'CSE Undergrad • UIU',
    bio: `I'm a self-taught CSE undergrad at United International University, currently in my 2nd year, splitting my focus between machine learning/AI and systems programming. My journey in tech started with curiosity about how things work under the hood, and that's since grown into documenting a full ML/AI learning path from Python fundamentals through Classical ML.

When I'm not coding, you'll find me competing in esports, solving Rubik's cubes, or tinkering with my Arch Linux + Hyprland setup. I believe in learning by building, which is why UIUNest — a fully original housing platform for UIU students — is the project I'm proudest of.`,
    email: 'a.marufhossain619@gmail.com',
    github: 'https://github.com/SpicyFalcon619',
    linkedin: 'https://www.linkedin.com/in/ahmad-maruf-hossain/',
    instagram: 'https://www.instagram.com/spicy_falconn/',
    avatar: '/assets/avatar.jpg'
  },
  education: [
    {
      degree: 'Bachelor of Science in Computer Science & Engineering',
      institution: 'United International University',
      period: 'June 2024 - Present',
      details: 'Currently pursuing my undergraduate degree. Focusing on core CS fundamentals, programming languages, and emerging tech like blockchain and AI.',
      courses: ['Data Structures', 'Algorithms', 'OOP', 'Database Systems']
    },
    {
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'Sena Public School & College',
      period: '2022 - 2023',
      details: 'Completed higher secondary with a focus on Mathematics, Physics, and Chemistry - a solid foundation for CS studies.',
      courses: ['Mathematics', 'Physics', 'Chemistry', 'ICT']
    }
  ],
  skills: {
    languages: ['C', 'C++', 'Java', 'Python', 'TypeScript', 'HTML/CSS/JS', 'PHP'],
    technologies: ['React', 'Next.js', 'NumPy', 'Pandas', 'MySQL', 'Solidity', 'Linux (Arch)', 'Hyprland', 'Git', 'Notion API'],
    soft: ['Problem Solving', 'Research', 'Team Collaboration', 'Quick Learning']
  },
  projects: [
    {
      id: 'uiunest',
      name: 'UIUNest',
      type: 'Marketplace',
      description: 'My proudest, fully original build — a housing & flatmate-matching platform for UIU students, with transparent all-in billing, an 8-dimension compatibility matching algorithm, and a dorm-essentials marketplace.',
      tags: ['Next.js', 'TypeScript', 'Marketplace', 'Full-Stack'],
      link: 'https://uiu-nest-core.vercel.app',
      extra: 'A fully original idea, not a tutorial clone — built from scratch for the UIU community.',
      icon: '/assets/icons/ie.png'
    },
    {
      id: 'ml-research-journey',
      name: 'ml-research-journey',
      type: 'ML/AI Learning Journey',
      description: 'Documenting my machine learning & AI journey from the ground up — Python foundations through NumPy, Pandas, and now Classical ML, working toward neural networks.',
      tags: ['Python', 'NumPy', 'Pandas', 'Machine Learning'],
      link: 'https://github.com/SpicyFalcon619/ml-research-journey',
      extra: 'What I\'m actively working on right now.',
      icon: '/assets/icons/education.png'
    },
    {
      id: 'wastopia',
      name: 'Wastopia',
      type: 'Blockchain Web App',
      description: 'A blockchain-powered waste-to-energy platform designed to bring transparency, efficiency, and community engagement to global waste management.',
      tags: ['Blockchain', 'Next.js', 'Research'],
      link: 'https://project-wastopia.vercel.app',
      extra: 'Won "Best Emerging Team" in Blockchain Category at UIU CSE FEST 2025.',
      icon: '/assets/icons/ie.png'
    },
    {
      id: 'yt-deepnote',
      name: 'YT-DeepNote',
      type: 'Chrome Extension',
      description: 'Your ultimate companion for deep learning on YouTube. Seamlessly capture timestamped Markdown notes, drop precision bookmarks, capture video screenshots, and 1-click sync your entire learning session directly to a Notion workspace.',
      tags: ['JavaScript', 'Chrome Extension', 'Notion API'],
      link: 'https://github.com/SpicyFalcon619/YT-DeepNote',
      extra: 'Boost your productivity and never lose track of a YouTube tutorial again with Notion integration.',
      icon: '/assets/icons/explorer.png'
    },
    {
      id: 'clearpath',
      name: 'ClearPath',
      type: 'Full-Stack Web App',
      description: 'A full-stack university clearance system with real-time approval tracking and PDF certificate generation, replacing paper-based clearance.',
      tags: ['PHP', 'MySQL', 'Full-Stack'],
      link: 'https://github.com/SpicyFalcon619/ClearPath',
      icon: '/assets/icons/ie.png'
    },
    {
      id: 'spicyfalcon-os',
      name: 'spicyfalcon-os',
      type: 'OS Simulation',
      description: 'A browser-based OS simulation acting as an interactive portfolio and desktop environment.',
      tags: ['JavaScript', 'HTML', 'CSS', 'OS Simulation'],
      link: 'https://spicyfalcon-os.vercel.app',
      extra: 'A creative way to showcase skills through a familiar desktop UI entirely in the browser.',
      icon: '/assets/icons/computer.png'
    },
    {
      id: 'morse-code',
      name: 'Morse Code Translator',
      type: 'Java Application',
      description: 'Classic Morse code translator for learning and teaching Java. Console and GUI implementations available.',
      tags: ['Java', 'Crypto'],
      link: 'https://spicy-morse-code-java.vercel.app/',
      icon: '/assets/icons/cmd.png'
    },
    {
      id: 'oop-notes',
      name: 'OOP Notes',
      type: 'Notion Document',
      description: 'Teaching notes prepared for classmates, including small utilities, references, and concepts explained in a simple and structured way.',
      tags: ['Teaching', 'Notion', 'Java'],
      link: 'https://bold-ocelot-ae1.notion.site/Theory-1d9b38bc56448124b6fce299b5459c4e',
      icon: '/assets/icons/notepad.png'
    }
  ]
};

export const aboutMeText = `================================================
Ahmad Maruf Hossain (spicyfalcon619)
================================================
CSE Undergrad • United International University

ABOUT ME
--------
${portfolioData.personal.bio}

SKILLS
------
Languages: ${portfolioData.skills.languages.join(', ')}
Technologies: ${portfolioData.skills.technologies.join(', ')}
Soft Skills: ${portfolioData.skills.soft.join(', ')}

EDUCATION
---------
${portfolioData.education.map(e => `* ${e.degree}\n  ${e.institution} (${e.period})\n  ${e.details}`).join('\n\n')}

CONTACT
-------
Email: ${portfolioData.personal.email}
GitHub: ${portfolioData.personal.github}
LinkedIn: ${portfolioData.personal.linkedin}
`;
