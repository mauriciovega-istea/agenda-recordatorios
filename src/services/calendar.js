import { Platform } from 'react-native';
// En el SDK 57 la API "legacy" es la que funciona dentro de Expo Go.
import * as Calendar from 'expo-calendar/legacy';
import { requestPermissionWithFeedback } from '../utils/permissions';
import { buildCalendarDetails } from '../utils/eventHelpers';

function getTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Argentina/Buenos_Aires';
  } catch (e) {
    return 'America/Argentina/Buenos_Aires';
  }
}

async function getWritableCalendarId() {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find((c) => c.allowsModifications);
  if (writable) return writable.id;

  // No hay calendarios editables: se crea uno local para la app
  const source =
    Platform.OS === 'ios'
      ? (await Calendar.getDefaultCalendarAsync()).source
      : { isLocalAccount: true, name: 'Agenda' };

  return Calendar.createCalendarAsync({
    title: 'Agenda / Recordatorios',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: source.id,
    source,
    name: 'agendaRecordatorios',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

/** Crea el evento en el calendario del dispositivo. Devuelve su id o null si no hay permiso. */
export async function addEventToCalendar(event) {
  const granted = await requestPermissionWithFeedback(
    () => Calendar.requestCalendarPermissionsAsync(),
    'calendario'
  );
  if (!granted) return null;

  const calendarId = await getWritableCalendarId();
  return Calendar.createEventAsync(calendarId, {
    ...buildCalendarDetails(event),
    timeZone: getTimeZone(),
  });
}
