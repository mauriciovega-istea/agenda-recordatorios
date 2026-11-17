import * as Contacts from 'expo-contacts/legacy';
import { requestPermissionWithFeedback } from '../utils/permissions';

/** Devuelve la lista de contactos [{ id, name, phone }] o null si no hay permiso. */
export async function loadContacts() {
  const granted = await requestPermissionWithFeedback(
    () => Contacts.requestPermissionsAsync(),
    'contactos'
  );
  if (!granted) return null;

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
    pageSize: 300,
  });

  return data
    .filter((c) => c.name)
    .map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phoneNumbers && c.phoneNumbers.length > 0 ? c.phoneNumbers[0].number : '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
