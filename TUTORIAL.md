# Building SpicyFalcon OS: Step-by-Step Developer Guide

This document chronicles the exact steps taken to build the SpicyFalcon OS from scratch. Your friends and other developers can follow these steps to build their own custom web-based operating system.

## Phase 0: Foundation
1. **Scaffold the App**: We initialized a React application using Vite for lightning-fast development.
2. **State Management**: We installed `zustand` to handle the complex state of our window manager (tracking coordinates, z-indexes, and active states) cleanly without prop-drilling.
3. **Design System**: We created `src/styles/globals.css` and established CSS Custom Properties (`:root`) for the Windows 7 Aero Glass aesthetic. This included specific variables for glassmorphism (`--aero-glass-bg`, `--aero-glass-shadow`) and defined strict z-index layers.
4. **Cleanup**: We removed the default Vite boilerplate from `App.jsx` and `main.jsx`.

## Phase 1: Window Manager Core
1. **The Brain (`useWindowStore.js`)**: We created a Zustand store to handle the window stack. It includes functions like `openWindow`, `closeWindow`, `focusWindow`, and `updateWindowPosition`. Crucially, it handles z-index arbitration so the focused window always comes to the front by incrementing a global z-index counter.
2. **The Window Frame (`Window.jsx`)**: We built a wrapper component that consumes the CSS variables to look like an Aero Glass window. It reads its size and position from the Zustand store.
3. **Bulletproof Dragging (`WindowTitleBar.jsx`)**: We implemented dragging using Pointer Events. The secret sauce here is `e.target.setPointerCapture(e.pointerId)`, which ensures dragging doesn't break or stutter even if the user moves their mouse wildly outside the window boundaries.

## Phase 2: Desktop Shell
1. **Desktop State (`useDesktopStore.js`)**: We created a second Zustand store specifically for the desktop to track desktop icon positions, selection states, and whether the Start Menu or Context Menu is visible.
2. **The Taskbar (`Taskbar.jsx`)**: We built a full-width bottom taskbar. It maps over the open windows in the `useWindowStore` to render active application buttons. Clicking them toggles the minimized state.
3. **The Start Menu (`StartMenu.jsx`)**: We built a popup menu triggered by a glowing Start Orb. It lists applications that trigger the `openWindow` action when clicked.
4. **Desktop Icons (`DesktopIcon.jsx`)**: We created draggable icons that live on the desktop layer. Double-clicking them executes `openWindow` to launch the respective application.
5. **Context Menu (`ContextMenu.jsx`)**: We intercepted the native right-click event (`onContextMenu`) on the Desktop wrapper to render a custom dropdown menu instead of the browser's default right-click menu.

## Phase 3: Application Windows
1. **Dynamic Routing (`AppRouter.jsx`)**: To prevent our main React bundle from becoming massively slow, we used React's `lazy` and `Suspense` to dynamically load application components based on the `windowData.component` string.
2. **App Components**: We scaffolded the individual components:
   - `Notepad.jsx`: A simple `textarea` bound to React state.
   - `InternetExplorer.jsx`: A working `iframe` browser.
   - `MSPaint.jsx`: A fully functional HTML5 `<canvas>` implementation utilizing a `useRef` and 2D context to track drawing states.
   - `CommandPrompt.jsx`: A simulated terminal using an array in React state to track command history, capturing the 'Enter' key to evaluate mock commands like `help` and `clear`.
   - `Calculator.jsx`: A functional calculator using mathematical evaluation.

---
*(This guide will be continually updated as we progress through Phases 4, 5, and 6).*
