# Project Roadmap: 2010s Windows 7 Themed Web Portfolio

## Technical Brief
- **Aesthetic**: Windows 7 Aero Glass (2010s era), colorful, vibrant UI with glassmorphism and glossy textures.
- **Features**: Notepad, Explorer, IE, MS Paint (functional), Minesweeper, Retro Spotify Player, CMD, Control Panel, Recycle Bin, My Computer, Calculator (advanced), Error Dialogs.
- **Interactions**: Draggable desktop icons, fully functional Start Menu, complex window management (z-index, minimize, maximize, restore).
- **Tech Stack**: React + Zustand for bulletproof atomic state management of the window stack and desktop icons.
- **Assets**: 2010s nostalgia Windows 7/Aero styled open-source icons (to be autonomously sourced and confirmed).

## Phase 0: Foundation
- Scaffold project using Vite (React).
- Configure CSS reset and root variables (`globals.css`) for the Windows 7 Aero theme (glassmorphism colors, drop shadows, window metrics, typography like Segoe UI).
- Set up project toolchain and Zustand store boilerplate.

## Phase 1: Window Manager Core
- Implement `useWindowStore` Zustand store (z-index arbitration, focus state, activeWindowId, minimized state).
- Build the base `Window` component handling drag (via pointer events), minimize-to-taskbar, maximize, and close functionalities.

## Phase 2: Desktop Shell
- Build the full-width, bottom-anchored Taskbar with glossy Aero effect.
- Build the Start Menu with pop-up animations, Windows orb (Start button) glow, and cascade sub-menus.
- Implement the Desktop icon grid with selection, drag-and-drop repositioning, and double-click to open logic.
- Add right-click context menus (custom desktop context menu).

## Phase 3: Application Windows
- Build individual isolated app components:
  - `Notepad` (Bio)
  - `WindowsExplorer` (Projects)
  - `InternetExplorer` (Weblinks)
  - `MSPaint` (Working canvas)
  - `Minesweeper` (Game)
  - `RetroSpotify` (Media player with playlist selection)
  - `CommandPrompt` (Terminal contact form)
  - `ControlPanel` (Settings/Theme)
  - `Calculator` (Advanced calculator)
  - `RecycleBin` & `MyComputer`
  - `ErrorDialog` components.

## Phase 4: Icon Integration
- Source and integrate an appropriate Windows 7 / Aero style SVG icon pack.
- Present icon choices to the user for final confirmation before mapping to apps/desktop.

## Phase 5: Polish & Responsiveness
- Add boot screen animation (Windows 7 style starting logo).
- Implement responsive degradation (e.g., "This site is best viewed on a desktop" warning for mobile).
- Refine animations, glass effects, borders, and shadows to perfect the 2010s aesthetic.

## Phase 6: Deployment
- Build optimization, static export, and final deployment config.

## Intended Project Structure
```text
/
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   ├── sounds/
│   │   └── wallpapers/
├── src/
│   ├── components/
│   │   ├── apps/
│   │   │   ├── Calculator.jsx
│   │   │   ├── CommandPrompt.jsx
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── InternetExplorer.jsx
│   │   │   ├── Minesweeper.jsx
│   │   │   ├── MSPaint.jsx
│   │   │   ├── Notepad.jsx
│   │   │   ├── RetroSpotify.jsx
│   │   │   └── WindowsExplorer.jsx
│   │   ├── desktop/
│   │   │   ├── ContextMenu.jsx
│   │   │   ├── DesktopIcon.jsx
│   │   │   ├── StartMenu.jsx
│   │   │   └── Taskbar.jsx
│   │   ├── window/
│   │   │   ├── Window.jsx
│   │   │   └── WindowTitleBar.jsx
│   │   └── shared/
│   │       └── ErrorDialog.jsx
│   ├── hooks/
│   │   └── useDrag.js
│   ├── store/
│   │   ├── useDesktopStore.js
│   │   └── useWindowStore.js
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```
