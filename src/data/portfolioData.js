export const portfolioData = {
  personal: {
    name: 'Ahmad Maruf Hossain',
    gamertag: 'spicyfalcon619',
    tagline: 'CSE Undergrad • UIU',
    bio: `I'm a CSE undergrad at United International University, in my 3rd year (8th trimester), and an Undergraduate Assistant for the Database Management System Lab. I build complete, working things: Nestly, a housing platform for UIU students built with three teammates; three interactive field guides that teach Java, machine learning and AI engineering with code you can run in the page; and Drawer 378, a searchable archive of my whole degree that other students use. With Team Anomaly I also built Shetu, an AI copilot that keeps a job safe through maternity leave and other planned leave, which is in the Final Round of the International AI Builders Congress 2026.

Right now I'm learning deep learning with PyTorch and working towards full AI applications (React, FastAPI and a model behind them). Off the keyboard: casual gaming, Rubik's cubes, and tuning my Arch Linux + Hyprland setup.`,
    email: 'a.marufhossain619@gmail.com',
    github: 'https://github.com/SpicyFalcon619',
    linkedin: 'https://www.linkedin.com/in/ahmad-maruf-hossain/',
    instagram: 'https://www.instagram.com/spicy_falconn/',
    avatar: '/assets/avatar.jpg'
  },
  research: [
    { area: 'Human-Computer Interaction', topics: ['Human-centred AI', 'Explainable and controllable AI', 'Interactive ML', 'AR/VR', 'Learning technology'] },
    { area: 'Artificial Intelligence', topics: ['Machine learning', 'NLP for Bangla and code-mixed Banglish', 'Applied AI with people in the loop'] },
    { area: 'Systems', topics: ['Blockchain', 'IoT and embedded systems'] }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science & Engineering',
      institution: 'United International University',
      period: 'June 2024 - Present',
      details: '3rd year, 8th trimester. Undergraduate Assistant for the Database Management System Lab since July 2026. Every course I have taken is archived and searchable in Drawer 378.',
      courses: ['Data Structures & Algorithms I, II', 'Object Oriented Programming', 'Database Management Systems', 'System Analysis & Design', 'Electronics', 'Artificial Intelligence', 'Computer Architecture', 'Software Engineering']
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
    languages: ['C', 'C++', 'Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'PHP', 'HTML/CSS'],
    technologies: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'MySQL', 'SQLite / Turso', 'NumPy', 'Pandas', 'scikit-learn', 'PyTorch', 'Flask', 'ESP32', 'Playwright', 'GitHub Actions', 'Git', 'Linux (Arch)', 'Notion API'],
    soft: ['Teaching', 'Technical Writing', 'Problem Solving', 'Research', 'Team Collaboration']
  },
  projects: [
    {
      id: 'shetu',
      name: 'Shetu',
      type: 'AI Copilot (team project)',
      description: "An AI copilot that keeps a job safe through a long leave: built around maternity leave, useful for any planned leave. MAP: an interview in Bangla, English or Banglish turns the employee's real duties into an evidence-backed Role Map, with an exact quote for every duty, and surfaces the ones they forgot. HOLD: the AI proposes cover for each duty, then nine deterministic rules check coverage, capacity and fairness; approval stays locked until every rule passes, and a change typed in plain words is re-checked. GUARD: at return, nothing moves to a colleague for good without the employee's agreement. The AI proposes, rules check, people decide. Deployed end to end (FastAPI, Next.js, PostgreSQL) with 31 automated tests, CI, an audit log and a model gateway (Groq with Gemini fallback; Claude and local models supported). Built by Team Anomaly with Sadia Noman Tonni, Mohammad Mahadi Hasan, Nazha Tarannum Roza and Rowshonur Rahman Rizvy. An earlier version reached Round 2 of Grameenphone FutureMakers 2026.",
      tags: ['AI', 'FastAPI', 'Next.js', 'PostgreSQL', 'Team project'],
      link: 'https://shetu-congress.vercel.app',
      repoLink: 'https://github.com/SpicyFalcon619/shetu-congress',
      extra: 'Final Round, International AI Builders Congress 2026 (InfraSphere AI domain).',
      icon: '/assets/icons/network.png'
    },
    {
      id: 'uiunest',
      name: 'Nestly',
      type: 'Full-Stack Platform',
      description: 'My proudest build, made with Sadia Noman Tonni, Nazha Tarannum Roza and Mohammad Mahadi Hasan: a platform for finding, verifying and living in shared student housing near Dhaka campuses. Every listing shows an itemised cost breakdown, flatmates get an 8-dimension compatibility score, landlords are verified by admins, mess bills split themselves, and Nestly Exchange handles second-hand furniture with offers and counter-offers. Real-time messaging and an admin analytics dashboard sit on top.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Realtime'],
      link: 'https://nestly-core.vercel.app',
      extra: 'A fully original idea, not a tutorial clone: built from scratch for the UIU community.',
      icon: '/assets/icons/ie.png'
    },
    {
      id: 'field-guides',
      name: 'Field Guides (Java, ML, AI Engineering)',
      type: 'Interactive Learning Sites',
      description: "Three guides on one shared app. The Java Field Guide follows UIU's OOP courses (CSE 1115/1116) for classmates; the ML Field Guide goes from Python to PyTorch; the AI Engineering guide goes from JavaScript to a React + FastAPI app. Every code block runs in the browser, the output shown is real captured output, and each site has a rail map of progress, a glossary and Ctrl+K search.",
      tags: ['React', 'TypeScript', 'Vite', 'Java', 'Python', 'GitHub Pages'],
      link: 'https://spicyfalcon619.github.io/java-field-guide/',
      extra: 'Grew out of the OOP notes I wrote for classmates.',
      icon: '/assets/icons/education.png'
    },
    {
      id: 'drawer-378',
      name: 'Drawer 378',
      type: 'Archive and Search',
      description: 'My whole CSE degree as a searchable catalogue: 3,000+ files across 37 courses. Typo-tolerant search with course abbreviations, a built-in viewer for PDFs, slides, documents and notebooks, and whole folders zipped in the browser. GitHub Pages caps a site at 1 GB, so a Python pipeline packs the 4.3 GB across five sites and publishes everything with one command.',
      tags: ['JavaScript', 'Python', 'PDF.js', 'GitHub Pages', 'Automation'],
      link: 'https://spicyfalcon619.github.io/University/',
      extra: 'Juniors use it to find past papers, slides and lab work by course.',
      icon: '/assets/icons/explorer.png'
    },
    {
      id: 'phytocast',
      name: 'PhytoCast',
      type: 'IoT + ML (team of 6)',
      description: 'A prevention-first smart plant-care system for the Electronics Lab. One ESP32 forecasts leaf-spot risk from temperature and humidity, irrigates in calibrated pulses, runs a fan and shade, monitors the reservoir and rain, and deters pests, streaming to a Flask dashboard over WiFi. A MobileNetV2 disease detector was retrained on 87,867 images across 38 classes, reaching 94.7% validation accuracy.',
      tags: ['ESP32', 'C++', 'Flask', 'MobileNetV2', 'Transfer Learning'],
      link: 'https://github.com/SpicyFalcon619/PhytoCast',
      icon: '/assets/icons/device-manager.png'
    },
    {
      id: 'mandela-catalogue',
      name: 'Mandela Catalogue Field Guide',
      type: 'Full-Stack Web App',
      description: 'An interactive fan guide to an analog-horror series: tape explorer, case files, threaded discussion with votes and moderation, accounts, and a full admin CMS. One async database interface runs on local SQLite or hosted Turso, with unit and Playwright end-to-end tests.',
      tags: ['Next.js', 'TypeScript', 'SQLite', 'Turso', 'Playwright'],
      link: 'https://mandela-catalogue.vercel.app',
      icon: '/assets/icons/photo-viewer.png'
    },
    {
      id: 'wastopia',
      name: 'Wastopia',
      type: 'Blockchain Web App',
      description: 'A blockchain-powered waste-to-energy platform designed to bring transparency, efficiency and community engagement to waste management.',
      tags: ['Blockchain', 'Next.js', 'Research'],
      link: 'https://project-wastopia.vercel.app',
      extra: 'Won "Best Emerging Team" in the Blockchain category at UIU CSE FEST 2025.',
      icon: '/assets/icons/recycle.png'
    },
    {
      id: 'yt-deepnote',
      name: 'YT-DeepNote',
      type: 'Chrome Extension',
      description: 'A companion for learning on YouTube: timestamped Markdown notes, precision bookmarks, video screenshots, and one-click sync of the whole session to a Notion workspace.',
      tags: ['JavaScript', 'Chrome Extension', 'Notion API'],
      link: 'https://github.com/SpicyFalcon619/YT-DeepNote',
      icon: '/assets/icons/explorer.png'
    },
    {
      id: 'clearpath',
      name: 'ClearPath',
      type: 'Full-Stack Web App',
      description: 'A full-stack university clearance system with real-time approval tracking and PDF certificate generation, replacing paper-based clearance.',
      tags: ['PHP', 'MySQL', 'Full-Stack'],
      link: 'https://github.com/SpicyFalcon619/ClearPath',
      icon: '/assets/icons/control-panel.png'
    },
    {
      id: 'spicyfalcon-os',
      name: 'spicyfalcon-os',
      type: 'OS Simulation',
      description: 'This site: a browser desktop with windows, a taskbar, a start menu and working apps (Paint, Minesweeper, a calculator, a command prompt and a music player), acting as an interactive portfolio.',
      tags: ['React', 'Zustand', 'Framer Motion', 'Vite'],
      link: 'https://spicyfalcon-os.vercel.app',
      icon: '/assets/icons/computer.png'
    },
    {
      id: 'research-os',
      name: 'research-os',
      type: 'Research Workspace',
      description: 'A beginner-friendly workspace for learning to find, read and evaluate academic papers: note templates, a literature matrix, a read-only Zotero sync with offline tests in CI, and an AI mentor setup that coaches instead of ghostwriting.',
      tags: ['Python', 'Zotero', 'GitHub Actions'],
      link: 'https://github.com/SpicyFalcon619/research-os',
      icon: '/assets/icons/notepad.png'
    },
    {
      id: 'claude-skills-setup',
      name: 'claude-skills-setup',
      type: 'Developer Tooling',
      description: 'One idempotent script (PowerShell and Bash) that installs a global AI coding toolkit on any machine: design skills checked in a real browser, Playwright, and 84 brand design systems, with security-sensitive tools deliberately left out.',
      tags: ['PowerShell', 'Bash', 'Automation'],
      link: 'https://github.com/SpicyFalcon619/claude-skills-setup',
      icon: '/assets/icons/cmd.png'
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

RESEARCH INTERESTS
------------------
${portfolioData.research.map(r => `${r.area}: ${r.topics.join(', ')}`).join('\n')}

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
