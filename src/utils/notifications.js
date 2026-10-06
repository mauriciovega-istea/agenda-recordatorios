import { LogBox, Platform } from 'react-native';

// Oculta el aviso de push remoto de Expo Go (no usamos push, solo notificaciones locales)
LogBox.ignoreLogs(['expo-notifications']);

let Notifications = null;
let loaded = false;
let loadError = null;

export const getLoadError = () => loadError;

// La librería se carga recién cuando se necesita, no al arrancar la app
function getNotifications() {
  if (loaded) return Notifications;
  loaded = true;
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    loadError = String((e && e.message) || e);
    Notifications = null;
  }
  return Notifications;
}

export const notificationsAvailable = () => getNotifications() !== null;

export async function setupNotifications() {
  const N = getNotifications();
  if (!N) return false;
  try {
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync('default', {
        name: 'Recordatorios',
        importance: N.AndroidImportance.MAX,
      });
    }
    const { status: current } = await N.getPermissionsAsync();
    if (current === 'granted') return true;
    const { status } = await N.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    return false;
  }
}

export async function scheduleEventNotification(title, date) {
  const N = getNotifications();
  if (!N) return null;
  try {
    return await N.scheduleNotificationAsync({
      content: { title: '📅 Recordatorio', body: title, sound: true },
      trigger: {
        type: N.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: 'default',
      },
    });
  } catch (e) {
    return null;
  }
}

export async function scheduleTestNotification(seconds = 5) {
  const N = getNotifications();
  if (!N) return null;
  return N.scheduleNotificationAsync({
    content: { title: '🔔 Notificación de prueba', body: 'Las notificaciones locales funcionan' },
    trigger: {
      type: N.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: 'default',
    },
  });
}

export async function cancelNotification(id) {
  const N = getNotifications();
  if (!N || !id) return;
  try {
    await N.cancelScheduledNotificationAsync(id);
  } catch (e) {}
}