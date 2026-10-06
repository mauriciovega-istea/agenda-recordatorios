import {
  parseDateTime,
  sortEventsByDate,
  validateCredentials,
  validateEvent,
} from '../src/utils/validation';

// Fecha fija para que los tests no dependan del día en que se ejecutan
const now = new Date(2026, 9, 6, 12, 0);

describe('Lógica de negocio (validation.js)', () => {
  describe('Validaciones', () => {
    it('rechaza una fecha inexistente como 31/02', () => {
      expect(parseDateTime('31/02/2027', '10:00')).toBeNull();
    });

    it('rechaza una hora fuera de rango como 25:00', () => {
      expect(parseDateTime('15/03/2027', '25:00')).toBeNull();
    });

    it('rechaza un evento con el título vacío', () => {
      expect(validateEvent({ title: '  ', date: '10/10/2026', time: '10:00' }, now)).toMatch(/título/i);
    });

    it('rechaza un evento con formato de fecha inválido', () => {
      expect(validateEvent({ title: 'X', date: '2026/10/10', time: '10:00' }, now)).toMatch(/inválida/i);
    });

    it('rechaza un evento con fecha pasada', () => {
      expect(validateEvent({ title: 'X', date: '01/01/2026', time: '10:00' }, now)).toMatch(/futuras/i);
    });

    it('rechaza un usuario con menos de 3 caracteres', () => {
      expect(validateCredentials('ab', '1234')).toMatch(/usuario/i);
    });

    it('rechaza una contraseña con menos de 4 caracteres', () => {
      expect(validateCredentials('abc', '12')).toMatch(/contraseña/i);
    });
  });

  describe('Flujo exitoso', () => {
    it('convierte una fecha y hora válidas en un objeto Date', () => {
      const d = parseDateTime('15/03/2027', '08:45');
      expect(d.getFullYear()).toBe(2027);
      expect(d.getMonth()).toBe(2);
      expect(d.getDate()).toBe(15);
      expect(d.getHours()).toBe(8);
      expect(d.getMinutes()).toBe(45);
    });

    it('acepta un evento con título, fecha futura y hora válidos', () => {
      expect(validateEvent({ title: 'Reunión', date: '10/10/2026', time: '10:00' }, now)).toBeNull();
    });

    it('acepta usuario y contraseña con la longitud mínima', () => {
      expect(validateCredentials('abc', '1234')).toBeNull();
    });

    it('ordena los eventos del más próximo al más lejano', () => {
      const sorted = sortEventsByDate([
        { id: 'b', timestamp: 20 },
        { id: 'a', timestamp: 10 },
      ]);
      expect(sorted.map((e) => e.id)).toEqual(['a', 'b']);
    });
  });
});