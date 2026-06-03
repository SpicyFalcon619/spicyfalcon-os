import { create } from 'zustand';

const initialIcons = [
  { id: 'recycle-bin',    title: 'Recycle Bin',    icon: '/assets/icons/recycle-bin.png', iconFull: '/assets/icons/recycle-bin-full.png', isEmpty: true, x: 20, y: 20 },
  { id: 'my-computer',   title: 'My Computer',     icon: '/assets/icons/computer.png',      component: 'my-computer', x: 20, y: 100 },
  { id: 'about-me',      title: 'About Me.txt',    icon: '/assets/icons/notepad.png',       component: 'portfolio', appData: { section: 'about' }, x: 20, y: 180 },
  { id: 'wastopia-icon', title: 'Wastopia',         icon: '/assets/icons/ie.png',            component: 'ie', appData: { url: 'https://project-wastopia.vercel.app' }, x: 20, y: 260 },
  { id: 'task-manager',  title: 'Task Manager',     icon: '/assets/icons/task-manager.svg',  x: 120, y: 20 },
  { id: 'device-manager','title': 'Device Manager', icon: '/assets/icons/device-manager.png', x: 120, y: 100 }
];

const useDesktopStore = create((set) => ({
  icons: initialIcons,
  selectedIconIds: [],
  contextMenu: { visible: false, x: 0, y: 0 },
  startMenuVisible: false,
  systemTrayPopup: null,
  globalVolume: 50,
  
  hasBooted: false,
  setHasBooted: () => set({ hasBooted: true }),
  setGlobalVolume: (vol) => set({ globalVolume: vol }),

  selectIcon: (id, multi = false) => set((state) => ({
    selectedIconIds: multi 
      ? (state.selectedIconIds.includes(id) ? state.selectedIconIds : [...state.selectedIconIds, id])
      : [id],
    contextMenu: { visible: false, x: 0, y: 0 },
    startMenuVisible: false,
    systemTrayPopup: null
  })),

  setSelection: (ids) => set({
    selectedIconIds: ids
  }),

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
