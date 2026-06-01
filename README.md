# Windows 7 Themed Web Portfolio (SpicyFalcon OS)

Welcome to the **SpicyFalcon OS** project! This repository contains the source code for a highly interactive, 2010s era Windows 7 (Aero Glass) themed web portfolio. It is designed to act as a nostalgic "desktop within a browser" experience, complete with draggable windows, a functional Start Menu, taskbar, and classic applications.

## Approach & Architecture

Building a complex window manager in the browser requires strict architectural discipline. We are building this project using the following tech stack:
- **Framework**: React (via Vite for lightning-fast HMR and building).
- **State Management**: Zustand (for atomic, predictable state across the window stack, desktop icons, and taskbar).
- **Styling**: Vanilla CSS with custom properties (`:root`) to perfectly emulate the glossy textures, glassmorphism, and metric precision of the Windows 7 Aero UI.

### Step-by-Step Implementation Guide

Our build process is rigorously divided into 6 distinct phases. This structured approach ensures stability, particularly for the complex Window Manager core, and allows anyone to follow along.

#### Phase 0: Foundation
- **Goal**: Scaffold the React application and establish the design system.
- **Actions**: Run Vite setup, create `globals.css` with a comprehensive suite of CSS variables for the Aero Glass aesthetic (colors, drop shadows, borders), and set up the Zustand boilerplate.

#### Phase 1: Window Manager Core
- **Goal**: The engine of the OS.
- **Actions**: Implement `useWindowStore` for z-index arbitration, focus states, and minimized/maximized states. Build the base `Window` component, utilizing pointer events for robust, glitch-free dragging and resizing.

#### Phase 2: Desktop Shell
- **Goal**: The environment containing the windows.
- **Actions**: Construct the bottom-anchored taskbar and Start Menu (with glowing Windows orb). Build the desktop icon grid with drag-and-drop repositioning and double-click logic. Implement right-click context menus.

#### Phase 3: Application Windows
- **Goal**: The actual portfolio content and interactive tools.
- **Actions**: Develop isolated components for each application:
  - Notepad (Bio/About)
  - Windows Explorer (Projects)
  - Internet Explorer (Web links)
  - MS Paint (Working canvas)
  - Minesweeper (Game)
  - Retro Spotify Player (Custom media player)
  - Command Prompt (Contact form)
  - Control Panel (Settings/Theme)
  - Calculator (Advanced)

#### Phase 4: Icon Integration
- **Goal**: Visual authenticity.
- **Actions**: Source and integrate period-accurate 32-bit Windows 7 / Aero styled SVG icons. 

#### Phase 5: Polish & Responsiveness
- **Goal**: The "Wow" factor.
- **Actions**: Add Windows 7 boot screen animations. Refine glass effects, borders, and shadows. Implement responsive degradation for mobile devices (as desktop environments don't map well to small touch screens).

#### Phase 6: Deployment
- **Goal**: Ship it.
- **Actions**: Optimize the build and configure for static deployment (e.g., Vercel, Netlify, or GitHub Pages).

## Getting Started

*(Development server instructions and scripts will be added here once the Vite foundation is scaffolded in Phase 0.)*
