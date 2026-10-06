// Lógica de negocio pura (fácil de testear).

export function validateCredentials(username, password) {
  if (!username || username.trim().length < 3) {
    return 'El usuario debe tener al menos 3 caracteres';
  }
  if (!password || password.length < 4) {
    return 'La contraseña debe tener al menos 4 caracteres';
  }
  return null;
}

/**
 * Convierte "DD/MM/YYYY" + "HH:MM" en un objeto Date.
 * Devuelve null si el formato o la fecha no son válidos (ej: 31/02/2026).
 */
export function parseDateTime(dateStr, timeStr) {
  const d = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((dateStr || '').trim());
  const t = /^(\d{2}):(\d{2})$/.exec((timeStr || '').trim());
  if (!d || !t) return null;

  const day = Number(d[1]);
  const month = Number(d[2]);
  const year = Number(d[3]);
  const hours = Number(t[1]);
  const minutes = Number(t[2]);

  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const isReal =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hours &&
    date.getMinutes() === minutes;

  return isReal ? date : null;
}

/** Devuelve un mensaje de error o null si el evento es válido. */
export function validateEvent({ title, date, time }, now = new Date()) {
  if (!title || !title.trim()) return 'El título es obligatorio';
  const parsed = parseDateTime(date, time);
  if (!parsed) return 'Fecha u hora inválida. Usá DD/MM/AAAA y HH:MM';
  if (parsed.getTime() <= now.getTime()) return 'La fecha y hora deben ser futuras';
  return null;
}

export const sortEventsByDate = (events) =>
  [...events].sort((a, b) => a.timestamp - b.timestamp);
