import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useConfigStore = create(
  persist(
    (set) => ({
      username: 'SpicyFalcon',
      osName: 'SpicyFalcon OS',
      isAdmin: false,
      wallpaper: '/assets/wallpapers/windows7-bg.jpg', // Default wallpaper
      
      setUsername: (name) => set({ username: name }),
      setOsName: (name) => set({ osName: name }),
      setAdmin: (val) => set({ isAdmin: val }),
      setWallpaper: (val) => set({ wallpaper: val }),
    }),
    {
      name: 'spicyfalcon-config',
    }
  )
);

export default useConfigStore;
