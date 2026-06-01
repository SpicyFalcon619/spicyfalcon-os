import { create } from 'zustand';

const initialIcons = [
  { id: 'computer', title: 'My Computer', icon: '💻', x: 20, y: 20 },
  { id: 'recycle-bin', title: 'Recycle Bin', icon: '🗑️', x: 20, y: 100 },
  { id: 'explorer', title: 'Projects', icon: '📁', x: 20, y: 180 },
  { id: 'ie', title: 'Internet Explorer', icon: '🌐', x: 20, y: 260 },
  { id: 'paint', title: 'MS Paint', icon: '🎨', x: 20, y: 340 },
];

const useDesktopStore = create((set) => ({
  icons: initialIcons,
  selectedIconIds: [],
  contextMenu: { visible: false, x: 0, y: 0 },
  startMenuVisible: false,
  systemTrayPopup: null,
  
  hasBooted: false,
  setHasBooted: () => set({ hasBooted: true }),

  selectIcon: (id, multi = false) => set((state) => ({
    selectedIconIds: multi 
      ? (state.selectedIconIds.includes(id) ? state.selectedIconIds : [...state.selectedIconIds, id])
      : [id],
    contextMenu: { visible: false, x: 0, y: 0 },
    startMenuVisible: false,
    systemTrayPopup: null
  })),

  clearSelection: () => set({ 
    selectedIconIds: [], 
    contextMenu: { visible: false, x: 0, y: 0 }, 
    startMenuVisible: false,
    systemTrayPopup: null 
  }),

  updateIconPosition: (id, x, y) => set((state) => ({
    icons: state.icons.map(icon => icon.id === id ? { ...icon, x, y } : icon)
  })),

  showContextMenu: (x, y) => set({
    contextMenu: { visible: true, x, y },
    startMenuVisible: false
  }),

  hideContextMenu: () => set({ contextMenu: { visible: false, x: 0, y: 0 } }),

  setSystemTrayPopup: (popup) => set((state) => ({ 
    systemTrayPopup: state.systemTrayPopup === popup ? null : popup,
    startMenuVisible: false,
    contextMenu: { visible: false, x: 0, y: 0 }
  })),

  toggleStartMenu: () => set((state) => ({
    startMenuVisible: !state.startMenuVisible,
    contextMenu: { visible: false, x: 0, y: 0 }
  })),

  hideStartMenu: () => set({ startMenuVisible: false })
}));

export default useDesktopStore;
