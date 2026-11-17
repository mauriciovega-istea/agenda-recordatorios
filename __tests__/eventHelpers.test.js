import {
  buildCalendarDetails,
  describeContact,
  describeLocation,
  formatCoords,
} from '../src/utils/eventHelpers';
import { getPermissionMessage, normalizePermission } from '../src/utils/permissionState';

describe('Permisos del dispositivo', () => {
  describe('Estados de permiso', () => {
    it('interpreta una respuesta concedida', () => {
      expect(normalizePermission({ status: 'granted', granted: true })).toBe('granted');
    });

    it('interpreta una respuesta denegada', () => {
      expect(normalizePermission({ status: 'denied', granted: false })).toBe('denied');
    });

    it('interpreta una respuesta pendiente', () => {
      expect(normalizePermission({ status: 'undetermined', granted: false })).toBe('undetermined');
      expect(normalizePermission(null)).toBe('undetermined');
    });
  });

  describe('Mensajes al usuario', () => {
    it('explica claramente cuando el permiso fue rechazado', () => {
      expect(getPermissionMessage('denied', 'cámara')).toMatch(/Rechazaste el permiso de cámara/);
    });

    it('avisa cuando el permiso sigue pendiente', () => {
      expect(getPermissionMessage('undetermined', 'ubicación')).toMatch(/Todavía no respondiste/);
    });
  });
});

describe('Datos asociados al evento', () => {
  describe('Ubicación', () => {
    it('formatea las coordenadas con 5 decimales', () => {
      expect(formatCoords(-32.8894587, -68.8458386)).toBe('-32.88946, -68.84584');
    });

    it('prefiere la dirección aproximada si existe', () => {
      const loc = { latitude: -32.89, longitude: -68.84, address: 'Av. San Martín 100, Mendoza' };
      expect(describeLocation(loc)).toBe('Av. San Martín 100, Mendoza');
    });

    it('usa las coordenadas cuando no hay dirección', () => {
      expect(describeLocation({ latitude: -32.89, longitude: -68.84, address: null })).toBe(
        '-32.89000, -68.84000'
      );
    });

    it('devuelve texto vacío si no hay ubicación', () => {
      expect(describeLocation(null)).toBe('');
    });
  });

  describe('Contacto', () => {
    it('muestra nombre y teléfono', () => {
      expect(describeContact({ name: 'Ana', phone: '2611234567' })).toBe('Ana · 2611234567');
    });

    it('muestra solo el nombre si no tiene teléfono', () => {
      expect(describeContact({ name: 'Ana', phone: '' })).toBe('Ana');
    });
  });
});

describe('Integración con el calendario', () => {
  const base = { title: 'Dentista', timestamp: new Date(2026, 11, 10, 9, 30).getTime() };

  describe('Armado del evento', () => {
    it('dura una hora por defecto', () => {
      const d = buildCalendarDetails(base);
      expect(d.endDate.getTime() - d.startDate.getTime()).toBe(60 * 60 * 1000);
    });

    it('usa el título y la fecha del evento de la app', () => {
      const d = buildCalendarDetails(base);
      expect(d.title).toBe('Dentista');
      expect(d.startDate.getHours()).toBe(9);
      expect(d.startDate.getMinutes()).toBe(30);
    });

    it('incluye una alarma 10 minutos antes', () => {
      expect(buildCalendarDetails(base).alarms).toEqual([{ relativeOffset: -10 }]);
    });
  });

  describe('Datos opcionales', () => {
    it('agrega ubicación y contacto cuando existen', () => {
      const d = buildCalendarDetails({
        ...base,
        location: { latitude: 1, longitude: 2, address: 'Consultorio Centro' },
        contact: { name: 'Dra. Pérez', phone: '2610000000' },
      });
      expect(d.location).toBe('Consultorio Centro');
      expect(d.notes).toMatch(/Dra\. Pérez/);
    });

    it('no define ubicación si el evento no la tiene', () => {
      expect(buildCalendarDetails(base).location).toBeUndefined();
    });
  });
});
