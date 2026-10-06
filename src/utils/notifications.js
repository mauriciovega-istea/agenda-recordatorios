import { Platform } from 'react-native';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationsAvailable = () => true;
export const getLoadError = () => null;

export async function setupNotifications() {
  try {
    if (Platform.OS === 'android') {
      try {
        await setNotificationChannelAsync('default', {
          name: 'Recordatorios',
          importance: AndroidImportance.HIGH,
        });
      } catch (e) {
        // En Expo Go puede fallar; no debe bloquear el permiso
      }
    }
    const current = await getPermissionsAsync();
    if (current.status === 'granted') return true;
    const requested = await requestPermissionsAsync({
      android: {},
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    return requested.status === 'granted';
  } catch (e) {
    return false;
  }
}

/** Programa una notificación para la fecha del evento. Devuelve su id o null. */
export async function scheduleEventNotification(title, date) {
  const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
  if (seconds <= 0) return null;
  try {
    return await scheduleNotificationAsync({
      content: { title: '📅 Recordatorio', body: title, sound: 'default' },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });
  } catch (e) {
    return null;
  }
}

/** Notificación de prueba a los X segundos. */
export async function scheduleTestNotification(seconds = 5) {
  return scheduleNotificationAsync({
    content: {
      title: '🔔 Notificación de prueba',
      body: 'Las notificaciones locales funcionan',
      sound: 'default',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
}

export async function cancelNotification(id) {
  if (!id) return;
  try {
    await cancelScheduledNotificationAsync(id);
  } catch (e) {}
}