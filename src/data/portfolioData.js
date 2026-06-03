export const portfolioData = {
  personal: {
    name: 'Ahmad Maruf Hossain',
    gamertag: 'spicyfalcon619',
    tagline: 'CSE Undergrad • UIU',
    bio: `I'm a passionate CSE undergrad at United International University, currently in my 2nd year. My journey in tech started with curiosity about how things work under the hood, leading me to explore system-level programming, blockchain technology, and software development.

When I'm not coding, you'll find me competing in esports, solving Rubik's cubes, or tinkering with my Arch Linux with Hyprland setup. I believe in learning by building, which is why I work on projects like Wastopia and various cipher implementations to deepen my understanding of technology.`,
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
    languages: ['C', 'C++', 'Java', 'HTML/CSS/JS', 'Python (Basic)'],
    technologies: ['Linux (Arch)', 'Hyprland', 'Git', 'Notion API', 'Blockchain', 'IoT Concepts'],
    soft: ['Problem Solving', 'Research', 'Team Collaboration', 'Quick Learning']
  },
  projects: [
    {
      id: 'wastopia',
      name: 'Wastopia',
      type: 'Blockchain Web App',
      description: 'A blockchain-powered waste-to-energy platform designed to bring transparency, efficiency, and community engagement to global waste management.',
      tags: ['Blockchain', 'Next.js', 'Tailwind', 'Research'],
      link: 'https://project-wastopia.vercel.app',
      extra: 'Won "Best Emerging Team" in Blockchain Category at UIU CSE FEST 2025.',
      icon: '/assets/icons/ie.png' 
    },
    {
      id: 'uiunest',
      name: 'UIUNest',
      type: 'Marketplace',
      description: 'A comprehensive housing, flatmate matching, and peer-to-peer marketplace platform built exclusively for UIU students and landlords.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Marketplace'],
      link: 'https://uiunest-production.up.railway.app/',
      extra: 'Simplifying student housing and item marketplace specifically designed for the UIU community.',
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
