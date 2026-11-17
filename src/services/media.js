import * as ImagePicker from 'expo-image-picker';
import { requestPermissionWithFeedback } from '../utils/permissions';

const OPTIONS = { mediaTypes: ['images'], quality: 0.6 };

/** Abre la cámara y devuelve la uri de la foto, o null si se canceló o no hay permiso. */
export async function takePhoto() {
  const granted = await requestPermissionWithFeedback(
    () => ImagePicker.requestCameraPermissionsAsync(),
    'cámara'
  );
  if (!granted) return null;
  const result = await ImagePicker.launchCameraAsync(OPTIONS);
  return result.canceled ? null : result.assets[0].uri;
}

/** Abre la galería y devuelve la uri de la imagen elegida, o null. */
export async function pickFromGallery() {
  const granted = await requestPermissionWithFeedback(
    () => ImagePicker.requestMediaLibraryPermissionsAsync(),
    'galería'
  );
  if (!granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync(OPTIONS);
  return result.canceled ? null : result.assets[0].uri;
}
