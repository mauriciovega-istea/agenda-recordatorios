import {
  parseDateTime,
  sortEventsByDate,
  validateCredentials,
  validateEvent,
} from '../src/utils/validation';

describe('parseDateTime', () => {
  it('parsea una fecha y hora válidas', () => {
    const d = parseDateTime('15/03/2027', '08:45');
    expect(d.getFullYear()).toBe(2027);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(15);
    expect(d.getHours()).toBe(8);
  });

  it('devuelve null para fechas inexistentes o mal formateadas', () => {
    expect(parseDateTime('31/02/2027', '10:00')).toBeNull();
    expect(parseDateTime('2027-03-15', '10:00')).toBeNull();
    expect(parseDateTime('15/03/2027', '25:00')).toBeNull();
  });
});

describe('validateEvent', () => {
  const now = new Date(2026, 9, 6, 12, 0);

  it('rechaza un título vacío', () => {
    expect(validateEvent({ title: '  ', date: '10/10/2026', time: '10:00' }, now)).toMatch(/título/i);
  });

  it('rechaza fechas pasadas', () => {
    expect(validateEvent({ title: 'X', date: '01/01/2026', time: '10:00' }, now)).toMatch(/futuras/i);
  });

  it('acepta un evento válido', () => {
    expect(validateEvent({ title: 'X', date: '10/10/2026', time: '10:00' }, now)).toBeNull();
  });
});

describe('validateCredentials', () => {
  it('valida longitud mínima de usuario y contraseña', () => {
    expect(validateCredentials('ab', '1234')).toMatch(/usuario/i);
    expect(validateCredentials('abc', '12')).toMatch(/contraseña/i);
    expect(validateCredentials('abc', '1234')).toBeNull();
  });
});

describe('sortEventsByDate', () => {
  it('ordena de más próximo a más lejano', () => {
    const sorted = sortEventsByDate([{ id: 'b', timestamp: 20 }, { id: 'a', timestamp: 10 }]);
    expect(sorted.map((e) => e.id)).toEqual(['a', 'b']);
  });
});
