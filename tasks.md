# Project Roadmap: 2010s Windows 7 Themed Web Portfolio

## Technical Brief
- **Aesthetic**: Windows 7 Aero Glass (2010s era), colorful, vibrant UI with glassmorphism and glossy textures.
- **Features**: Notepad, Explorer, IE, MS Paint, Minesweeper, Retro Spotify Player (Spicetify), CMD, Control Panel apps (Task Manager, Device Manager, System Properties), Recycle Bin, My Computer, Calculator, Error Dialogs, Photo Viewer, System Info (Spicyver).
- **Interactions**: Draggable desktop icons, fully functional Start Menu, complex window management (z-index, minimize, maximize, restore, resizing).
- **Tech Stack**: React + Zustand for bulletproof atomic state management of the window stack and desktop icons.
- **Assets**: Authentic Windows 7 styled icons.

## Phase 0: Foundation (Completed)
- Scaffold project using Vite (React).
- Configure CSS reset and root variables (`globals.css`) for the Windows 7 Aero theme (glassmorphism colors, drop shadows, window metrics, typography like Segoe UI).
- Set up project toolchain and Zustand store boilerplate.

## Phase 1: Window Manager Core (Completed)
- Implement `useWindowStore` Zustand store (z-index arbitration, focus state, activeWindowId, minimized state).
- Build the base `Window` component handling drag (via pointer events), resize, minimize-to-taskbar, maximize, and close functionalities.

## Phase 2: Desktop Shell (Completed)
- Build the full-width, bottom-anchored Taskbar with glossy Aero effect.
- Build the Start Menu with pop-up animations, Windows orb (Start button) glow, and cascade sub-menus.
- Implement the Desktop icon grid with selection, drag-and-drop repositioning, and double-click to open logic.
- Add right-click context menus (custom desktop context menu).

## Phase 3: Application Windows (Completed)
- Build individual isolated app components:
  - `Notepad` (Bio)
  - `WindowsExplorer` (Projects)
  - `InternetExplorer` (Weblinks)
  - `MSPaint` (Working canvas)
  - `Minesweeper` (Game)
  - `Spicetify` (Spotify embedded media player)
  - `CommandPrompt` (Terminal interface)
  - `Calculator` (Advanced calculator)
  - `RecycleBin`, `MyComputer`, `SystemFolder`
  - `TaskManager`, `DeviceManager`, `SystemProperties`
  - `PhotoViewer`
  - `Portfolio`
  - `Spicyver` (About OS)
  - `ErrorDialog` components.

## Phase 4: Icon Integration (Completed)
- Source and integrate an appropriate Windows 7 style PNG icon pack.
- Replaced custom SVGs with official Windows 7 style raster icons to increase period authenticity.

## Phase 5: Polish & Responsiveness (Completed)
- Add boot screen animation (Windows 7 style starting logo + custom logo).
- Implement responsive degradation (e.g., "This site is best viewed on a desktop" warning for mobile).
- Refine animations, glass effects, borders, and shadows to perfect the 2010s aesthetic.
- Add sound effects for taskbar interaction.

## Phase 6: Deployment (Completed)
- Build optimization, static export, and final deployment config.

## Intended Project Structure
```text
/
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   ├── sounds/
│   │   ├── wallpapers/
│   │   └── my-logo.png
├── src/
│   ├── components/
│   │   ├── apps/
│   │   │   ├── AppRouter.jsx
│   │   │   ├── Calculator.jsx
│   │   │   ├── CommandPrompt.jsx
│   │   │   ├── DeviceManager.jsx
│   │   │   ├── InternetExplorer.jsx
│   │   │   ├── Minesweeper.jsx
│   │   │   ├── MSPaint.jsx
│   │   │   ├── MyComputer.jsx
│   │   │   ├── Notepad.jsx
│   │   │   ├── PhotoViewer.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── RecycleBin.jsx
│   │   │   ├── Spicetify.jsx
│   │   │   ├── Spicyver.jsx
│   │   │   ├── SystemFolder.jsx
│   │   │   ├── SystemProperties.jsx
│   │   │   ├── TaskManager.jsx
│   │   │   └── WindowsExplorer.jsx
│   │   ├── desktop/
│   │   │   ├── ContextMenu.jsx
│   │   │   ├── Desktop.jsx
│   │   │   ├── DesktopIcon.jsx
│   │   │   ├── StartMenu.jsx
│   │   │   ├── SystemTrayPopups.jsx
│   │   │   └── Taskbar.jsx
│   │   ├── window/
│   │   │   ├── Window.jsx
│   │   │   ├── WindowResizer.jsx
│   │   │   └── WindowTitleBar.jsx
│   │   └── shared/
│   │       ├── BootScreen.jsx
│   │       └── ErrorDialog.jsx
│   ├── store/
│   │   ├── useConfigStore.js
│   │   ├── useDesktopStore.js
│   │   └── useWindowStore.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```
