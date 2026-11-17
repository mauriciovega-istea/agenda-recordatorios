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

import { useAuthStore } from '../src/store/useAuthStore';

describe('Store global de autenticación (Zustand)', () => {
  beforeEach(() => {
    useAuthStore.setState({ users: [], currentUser: null });
  });

  describe('Registro', () => {
    it('registra un usuario válido', () => {
      const result = useAuthStore.getState().register('mauricio', '1234');
      expect(result.ok).toBe(true);
      expect(useAuthStore.getState().users).toHaveLength(1);
    });

    it('rechaza un usuario repetido sin importar mayúsculas', () => {
      const { register } = useAuthStore.getState();
      register('mauricio', '1234');
      const result = register('MAURICIO', 'abcd');
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/existe/i);
    });

    it('rechaza credenciales demasiado cortas', () => {
      const result = useAuthStore.getState().register('ab', '12');
      expect(result.ok).toBe(false);
      expect(useAuthStore.getState().users).toHaveLength(0);
    });
  });

  describe('Inicio y cierre de sesión', () => {
    beforeEach(() => {
      useAuthStore.getState().register('mauricio', '1234');
    });

    it('inicia sesión con los datos correctos', () => {
      const result = useAuthStore.getState().login('mauricio', '1234');
      expect(result.ok).toBe(true);
      expect(useAuthStore.getState().currentUser).toBe('mauricio');
    });

    it('rechaza una contraseña incorrecta', () => {
      const result = useAuthStore.getState().login('mauricio', 'mal');
      expect(result.ok).toBe(false);
      expect(useAuthStore.getState().currentUser).toBeNull();
    });

    it('cierra la sesión', () => {
      useAuthStore.getState().login('mauricio', '1234');
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().currentUser).toBeNull();
    });
  });
});
