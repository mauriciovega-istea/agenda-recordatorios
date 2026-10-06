import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { getEvents, saveEvents } from '../storage/storage';
import { scheduleEventNotification } from '../utils/notifications';
import { parseDateTime, validateEvent } from '../utils/validation';
import { formStyles as styles } from './formStyles';

export default function AddEventScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSave = async () => {
    const error = validateEvent({ title, date, time });
    if (error) {
      Alert.alert('Revisá los datos', error);
      return;
    }

    const when = parseDateTime(date, time);
    const notificationId = await scheduleEventNotification(title.trim(), when);

    const newEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      timestamp: when.getTime(),
      notificationId,
    };

    const current = await getEvents(user);
    await saveEvents(user, [...current, newEvent]);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { justifyContent: 'flex-start' }]}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} placeholder="Ej: Reunión con el equipo" value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Fecha (DD/MM/AAAA)</Text>
      <TextInput style={styles.input} placeholder="07/10/2026" keyboardType="numbers-and-punctuation" value={date} onChangeText={setDate} />
      <Text style={styles.label}>Hora (HH:MM, 24 hs)</Text>
      <TextInput style={styles.input} placeholder="15:30" keyboardType="numbers-and-punctuation" value={time} onChangeText={setTime} />
      <PrimaryButton title="Guardar evento" onPress={handleSave} />
    </View>
  );
}
