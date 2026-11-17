import * as Location from 'expo-location';
import { requestPermissionWithFeedback } from '../utils/permissions';
import { buildManualLocation } from '../utils/eventHelpers';

/** Devuelve { latitude, longitude, address } o null si no hay permiso. */
export async function getCurrentLocation() {
  const granted = await requestPermissionWithFeedback(
    () => Location.requestForegroundPermissionsAsync(),
    'ubicación'
  );
  if (!granted) return null;

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const { latitude, longitude } = position.coords;

  let address = null;
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (place) {
      address =
        [place.name || place.street, place.city || place.subregion]
          .filter(Boolean)
          .join(', ') || null;
    }
  } catch (e) {
    // Sin dirección aproximada: se muestran las coordenadas
  }

  return { latitude, longitude, address };
}

/**
 * Convierte una dirección escrita por el usuario en una ubicación.
 * Intenta obtener las coordenadas; si no puede, devuelve solo el texto.
 * Devuelve null si el texto está vacío.
 */
export async function geocodeAddress(text) {
  let coords = null;
  try {
    const results = await Location.geocodeAsync((text || '').trim());
    if (results && results.length > 0) coords = results[0];
  } catch (e) {
    // Sin coordenadas: se guarda solo la dirección escrita
  }
  return buildManualLocation(text, coords);
}
