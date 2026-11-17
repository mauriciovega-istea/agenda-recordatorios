// AsyncStorage simulado en memoria para poder probar el store sin dispositivo
jest.mock('@react-native-async-storage/async-storage', () => {
  const memory = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) => (key in memory ? memory[key] : null)),
      setItem: jest.fn(async (key, value) => {
        memory[key] = value;
      }),
      removeItem: jest.fn(async (key) => {
        delete memory[key];
      }),
    },
  };
});

import { useEventsStore } from '../src/store/useEventsStore';

const evento = (id, extra = {}) => ({
  id,
  owner: 'mauricio',
  title: `Evento ${id}`,
  date: '10/12/2026',
  time: '10:00',
  timestamp: 1000 + Number(id),
  ...extra,
});

describe('Store global de eventos (Zustand)', () => {
  beforeEach(() => {
    useEventsStore.setState({ events: [] });
  });

  describe('Estado inicial', () => {
    it('arranca con la lista de eventos vacía', () => {
      expect(useEventsStore.getState().events).toEqual([]);
    });
  });

  describe('Acciones', () => {
    it('addEvent agrega un evento a la lista', () => {
      useEventsStore.getState().addEvent(evento('1'));
      const { events } = useEventsStore.getState();
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe('Evento 1');
    });

    it('addEvent conserva los datos de foto, ubicación y contacto', () => {
      useEventsStore.getState().addEvent(
        evento('1', {
          photoUri: 'file://foto.jpg',
          location: { latitude: -32.89, longitude: -68.84, address: 'Av. San Martín, Mendoza' },
          contact: { name: 'Ana', phone: '2611234567' },
        })
      );
      const saved = useEventsStore.getState().events[0];
      expect(saved.photoUri).toBe('file://foto.jpg');
      expect(saved.location.address).toBe('Av. San Martín, Mendoza');
      expect(saved.contact.name).toBe('Ana');
    });

    it('removeEvent elimina solo el evento indicado', () => {
      const { addEvent, removeEvent } = useEventsStore.getState();
      addEvent(evento('1'));
      addEvent(evento('2'));
      removeEvent('1');
      const { events } = useEventsStore.getState();
      expect(events).toHaveLength(1);
      expect(events[0].id).toBe('2');
    });

    it('updateEvent modifica los campos del evento indicado sin tocar los demás', () => {
      const { addEvent, updateEvent } = useEventsStore.getState();
      addEvent(evento('1'));
      addEvent(evento('2'));
      updateEvent('1', { calendarEventId: 'cal-99' });
      const { events } = useEventsStore.getState();
      expect(events.find((e) => e.id === '1').calendarEventId).toBe('cal-99');
      expect(events.find((e) => e.id === '2').calendarEventId).toBeUndefined();
    });
  });
});
