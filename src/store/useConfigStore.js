import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useConfigStore = create(
  persist(
    (set) => ({
      username: 'SpicyFalcon',
      osName: 'SpicyFalcon OS',
      isAdmin: false,
      
      setUsername: (name) => set({ username: name }),
      setOsName: (name) => set({ osName: name }),
      setAdmin: (val) => set({ isAdmin: val }),
    }),
    {
      name: 'spicyfalcon-config',
    }
  )
);

export default useConfigStore;
