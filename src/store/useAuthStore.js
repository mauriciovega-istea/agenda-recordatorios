import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateCredentials } from '../utils/validation';

// Store global de autenticación (reemplaza al antiguo AuthContext).
export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      register: (username, password) => {
        const error = validateCredentials(username, password);
        if (error) return { ok: false, error };

        const name = username.trim();
        const exists = get().users.some((u) => u.username.toLowerCase() === name.toLowerCase());
        if (exists) return { ok: false, error: 'Ese usuario ya existe' };

        set((state) => ({ users: [...state.users, { username: name, password }] }));
        return { ok: true };
      },

      login: (username, password) => {
        const name = (username || '').trim().toLowerCase();
        const found = get().users.find(
          (u) => u.username.toLowerCase() === name && u.password === password
        );
        if (!found) return { ok: false, error: 'Usuario o contraseña incorrectos' };

        set({ currentUser: found.username });
        return { ok: true };
      },

      logout: () => set({ currentUser: null }),
    }),
    {
      name: '@agenda_auth_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ users: state.users, currentUser: state.currentUser }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);
