import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store global de eventos: lista principal de la app, con acciones para
// agregar, eliminar y actualizar. Se guarda en AsyncStorage.
export const useEventsStore = create(
  persist(
    (set) => ({
      events: [],

      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),

      removeEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

      updateEvent: (id, changes) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...changes } : e)),
        })),
    }),
    {
      name: '@agenda_events_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ events: state.events }),
    }
  )
);
