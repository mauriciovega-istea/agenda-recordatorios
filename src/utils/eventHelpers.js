// Funciones puras para mostrar y exportar los datos de un evento.

export const formatCoords = (latitude, longitude) =>
  `${Number(latitude).toFixed(5)}, ${Number(longitude).toFixed(5)}`;

/** Devuelve la dirección si existe; si no, las coordenadas (si las hay). */
export function describeLocation(location) {
  if (!location) return '';
  if (location.address) return location.address;
  if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
    return formatCoords(location.latitude, location.longitude);
  }
  return '';
}

/**
 * Arma la ubicación cuando el usuario escribe una dirección a mano.
 * Si no se pudieron obtener coordenadas, se guarda solo el texto.
 */
export function buildManualLocation(address, coords) {
  const text = (address || '').trim();
  if (!text) return null;
  const hasCoords =
    coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number';
  return {
    latitude: hasCoords ? coords.latitude : null,
    longitude: hasCoords ? coords.longitude : null,
    address: text,
  };
}

export function describeContact(contact) {
  if (!contact) return '';
  return contact.phone ? `${contact.name} · ${contact.phone}` : contact.name;
}

/** Convierte un evento de la app en los datos que necesita el calendario del dispositivo. */
export function buildCalendarDetails(event, durationMinutes = 60) {
  const startDate = new Date(event.timestamp);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const notes = [];
  if (event.contact) notes.push(`Contacto: ${describeContact(event.contact)}`);
  notes.push('Creado desde la app Agenda / Recordatorios');

  const details = {
    title: event.title,
    startDate,
    endDate,
    notes: notes.join('\n'),
    alarms: [{ relativeOffset: -10 }],
  };
  if (event.location) details.location = describeLocation(event.location);
  return details;
}
