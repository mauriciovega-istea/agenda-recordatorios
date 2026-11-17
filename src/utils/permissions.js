import { Alert, Linking } from 'react-native';
import { getPermissionMessage, normalizePermission } from './permissionState';

/**
 * Pide un permiso y maneja los tres estados (concedido, denegado, pendiente).
 * Devuelve true solo si el permiso fue concedido; si no, muestra un mensaje claro.
 */
export async function requestPermissionWithFeedback(requestFn, label) {
  let response;
  try {
    response = await requestFn();
  } catch (e) {
    Alert.alert('Error', `No se pudo solicitar el permiso de ${label}.`);
    return false;
  }

  const state = normalizePermission(response);
  if (state === 'granted') return true;

  const buttons = [{ text: 'Entendido', style: 'cancel' }];
  if (response && response.canAskAgain === false) {
    buttons.push({ text: 'Abrir ajustes', onPress: () => Linking.openSettings() });
  }
  Alert.alert(`Permiso de ${label}`, getPermissionMessage(state, label), buttons);
  return false;
}
