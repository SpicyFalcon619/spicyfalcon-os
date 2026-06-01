import { create } from 'zustand';

const useWindowStore = create((set) => ({
  windowStack: [],
  activeWindowId: null,
  zIndexBase: 100,

  // Boilerplate for Phase 1
  openWindow: (windowData) => set((state) => {
    return state;
  }),
  
  closeWindow: (id) => set((state) => {
    return state;
  }),
  
  focusWindow: (id) => set((state) => {
    return state;
  })
}));

export default useWindowStore;
