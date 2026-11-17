import React, { useEffect, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EventItem from '../components/EventItem';
import PrimaryButton from '../components/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { useEventsStore } from '../store/useEventsStore';
import { addEventToCalendar } from '../services/calendar';
import {
  cancelNotification,
  notificationsAvailable,
  scheduleTestNotification,
  setupNotifications,
} from '../utils/notifications';
import { sortEventsByDate } from '../utils/validation';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  // Todo el estado sale de los stores globales (Zustand)
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const allEvents = useEventsStore((state) => state.events);
  const removeEvent = useEventsStore((state) => state.removeEvent);
  const updateEvent = useEventsStore((state) => state.updateEvent);
  const insets = useSafeAreaInsets();

  const events = useMemo(
    () => sortEventsByDate(allEvents.filter((e) => e.owner === currentUser)),
    [allEvents, currentUser]
  );

  useEffect(() => {
    setupNotifications();
  }, []);

  const handleDelete = async (id) => {
    const target = allEvents.find((e) => e.id === id);
    await cancelNotification(target?.notificationId);
    removeEvent(id);
  };

  const handleAddToCalendar = async (event) => {
    try {
      const calendarEventId = await addEventToCalendar(event);
      if (calendarEventId) {
        updateEvent(event.id, { calendarEventId });
        Alert.alert('Calendario', 'El evento se agregó al calendario del dispositivo.');
      }
    } catch (e) {
      Alert.alert('Calendario', 'No se pudo crear el evento en el calendario.');
    }
  };

  const handleTest = async () => {
    if (!notificationsAvailable()) {
      Alert.alert(
        'Notificaciones',
        'Las notificaciones locales funcionan en la app instalada (APK), no en Expo Go de Android.'
      );
      return;
    }
    try {
      await scheduleTestNotification(5);
      Alert.alert('Programada', 'Vas a recibir una notificación en 5 segundos.');
    } catch (e) {
      Alert.alert('Notificaciones', 'No se pudo programar la notificación.');
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.welcome}>{`Hola, ${currentUser} 👋`}</Text>
        <Text style={styles.logout} onPress={logout}>Salir</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventItem event={item} onDelete={handleDelete} onAddToCalendar={handleAddToCalendar} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tenés eventos todavía.</Text>}
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      <PrimaryButton title="+ Nuevo evento" onPress={() => navigation.navigate('AddEvent')} />
      <PrimaryButton title="Probar notificación (5 s)" variant="secondary" onPress={handleTest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  welcome: { fontSize: 18, fontWeight: '600', color: colors.text },
  logout: { color: colors.danger, fontWeight: '600', fontSize: 16 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
});
