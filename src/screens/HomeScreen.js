import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EventItem from '../components/EventItem';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { getEvents, saveEvents } from '../storage/storage';
import {
  cancelNotification,
  notificationsAvailable,
  scheduleTestNotification,
  setupNotifications,
} from '../utils/notifications';
import { sortEventsByDate } from '../utils/validation';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setupNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getEvents(user).then((list) => setEvents(sortEventsByDate(list)));
    }, [user])
  );

  const handleDelete = async (id) => {
    const target = events.find((e) => e.id === id);
    await cancelNotification(target?.notificationId);
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    await saveEvents(user, updated);
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
        <Text style={styles.welcome}>{`Hola, ${user} 👋`}</Text>
        <Text style={styles.logout} onPress={logout}>Salir</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventItem event={item} onDelete={handleDelete} />}
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