import { create } from 'zustand';

const useWindowStore = create((set) => ({
  windows: [], // { id, component, title, icon, x, y, width, height, isMinimized, isMaximized, zIndex }
  activeWindowId: null,
  zIndexCounter: 100,
  lastSpawnPos: { x: 50, y: 50 },

  openWindow: (windowData) => set((state) => {
    // If window already exists, focus and un-minimize it
    const existing = state.windows.find(w => w.id === windowData.id);
    if (existing) {
      return {
        windows: state.windows.map(w => 
          w.id === windowData.id ? { ...w, isMinimized: false, zIndex: state.zIndexCounter + 1 } : w
        ),
        activeWindowId: windowData.id,
        zIndexCounter: state.zIndexCounter + 1
      };
    }

    const newZIndex = state.zIndexCounter + 1;
    // Offset spawn position to avoid full occlusion
    const newPos = { 
      x: state.lastSpawnPos.x + 20 > window.innerWidth - 200 ? 50 : state.lastSpawnPos.x + 20, 
      y: state.lastSpawnPos.y + 20 > window.innerHeight - 200 ? 50 : state.lastSpawnPos.y + 20 
    };

    const newWindow = {
      ...windowData,
      x: windowData.x ?? newPos.x,
      y: windowData.y ?? newPos.y,
      width: windowData.width ?? 600,
      height: windowData.height ?? 400,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex
    };

    return {
      windows: [...state.windows, newWindow],
      activeWindowId: windowData.id,
      zIndexCounter: newZIndex,
      lastSpawnPos: newPos
    };
  }),

  closeWindow: (id) => set((state) => {
    const remaining = state.windows.filter(w => w.id !== id);
    return {
      windows: remaining,
      activeWindowId: state.activeWindowId === id 
        ? (remaining.length > 0 ? remaining[remaining.length - 1].id : null) 
        : state.activeWindowId
    };
  }),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  restoreWindow: (id) => set((state) => {
    const newZIndex = state.zIndexCounter + 1;
    return {
      windows: state.windows.map(w => 
        w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      zIndexCounter: newZIndex
    };
  }),

  toggleMaximize: (id) => set((state) => {
    const newZIndex = state.zIndexCounter + 1;
    return {
      windows: state.windows.map(w => 
        w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      zIndexCounter: newZIndex
    };
  }),

  focusWindow: (id) => set((state) => {
    if (state.activeWindowId === id) return state; // Already focused
    const newZIndex = state.zIndexCounter + 1;
    return {
      windows: state.windows.map(w => 
        w.id === id ? { ...w, zIndex: newZIndex } : w
      ),
      activeWindowId: id,
      zIndexCounter: newZIndex
    };
  }),

  updateWindowPosition: (id, x, y) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, x, y } : w)
  })),

  updateWindowSize: (id, width, height) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, width, height } : w)
  }))
}));

export default useWindowStore;
