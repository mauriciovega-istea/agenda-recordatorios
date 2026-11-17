import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ContactPickerModal from '../components/ContactPickerModal';
import { useAuthStore } from '../store/useAuthStore';
import { useEventsStore } from '../store/useEventsStore';
import { pickFromGallery, takePhoto } from '../services/media';
import { geocodeAddress, getCurrentLocation } from '../services/location';
import { loadContacts } from '../services/contacts';
import { addEventToCalendar } from '../services/calendar';
import { scheduleEventNotification } from '../utils/notifications';
import { parseDateTime, validateEvent } from '../utils/validation';
import { describeContact, describeLocation } from '../utils/eventHelpers';
import { colors } from '../theme';

export default function AddEventScreen({ navigation }) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const addEvent = useEventsStore((state) => state.addEvent);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [contact, setContact] = useState(null);
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsVisible, setContactsVisible] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCamera = async () => {
    try {
      const uri = await takePhoto();
      if (uri) setPhotoUri(uri);
    } catch (e) {
      Alert.alert('Cámara', 'No se pudo abrir la cámara.');
    }
  };

  const handleGallery = async () => {
    try {
      const uri = await pickFromGallery();
      if (uri) setPhotoUri(uri);
    } catch (e) {
      Alert.alert('Galería', 'No se pudo abrir la galería.');
    }
  };

  const handleLocation = async () => {
    setLoadingLocation(true);
    try {
      const result = await getCurrentLocation();
      if (result) setLocation(result);
    } catch (e) {
      Alert.alert('Ubicación', 'No se pudo obtener la ubicación. Revisá que el GPS esté activado.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleManualAddress = async () => {
    if (!manualAddress.trim()) {
      Alert.alert('Ubicación', 'Escribí una dirección o el nombre de un lugar.');
      return;
    }
    setSearchingAddress(true);
    const result = await geocodeAddress(manualAddress);
    setSearchingAddress(false);
    if (!result) return;
    setLocation(result);
    setManualAddress('');
    if (result.latitude === null) {
      Alert.alert(
        'Ubicación',
        'No pudimos ubicarla en el mapa, pero se guardará la dirección que escribiste.'
      );
    }
  };

  const handleChooseContact = async () => {
    try {
      const list = await loadContacts();
      if (list) {
        setContacts(list);
        setContactsVisible(true);
      }
    } catch (e) {
      Alert.alert('Contactos', 'No se pudieron leer los contactos.');
    }
  };

  const handleSave = async () => {
    const error = validateEvent({ title, date, time });
    if (error) {
      Alert.alert('Revisá los datos', error);
      return;
    }

    setSaving(true);
    const when = parseDateTime(date, time);
    const notificationId = await scheduleEventNotification(title.trim(), when);

    const newEvent = {
      id: Date.now().toString(),
      owner: currentUser,
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      timestamp: when.getTime(),
      notificationId,
      photoUri,
      location,
      contact,
      calendarEventId: null,
    };

    if (addToCalendar) {
      try {
        newEvent.calendarEventId = await addEventToCalendar(newEvent);
      } catch (e) {
        Alert.alert('Calendario', 'No se pudo crear el evento en el calendario.');
      }
    }

    addEvent(newEvent);
    setSaving(false);
    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} placeholder="Ej: Reunión con el equipo" value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Fecha (DD/MM/AAAA)</Text>
      <TextInput style={styles.input} placeholder="07/10/2026" keyboardType="numbers-and-punctuation" value={date} onChangeText={setDate} />
      <Text style={styles.label}>Hora (HH:MM, 24 hs)</Text>
      <TextInput style={styles.input} placeholder="15:30" keyboardType="numbers-and-punctuation" value={time} onChangeText={setTime} />

      <Text style={styles.section}>📷 Foto</Text>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} /> : null}
      <View style={styles.row}>
        <PrimaryButton title="Cámara" variant="secondary" onPress={handleCamera} style={styles.half} />
        <PrimaryButton title="Galería" variant="secondary" onPress={handleGallery} style={styles.half} />
      </View>

      <Text style={styles.section}>📍 Ubicación</Text>
      {location ? <Text style={styles.value}>{describeLocation(location)}</Text> : null}
      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Escribí una dirección o lugar (ej: Av. San Martín 1200, Mendoza)"
        value={manualAddress}
        onChangeText={setManualAddress}
      />
      <PrimaryButton
        title={searchingAddress ? 'Buscando...' : 'Usar esta dirección'}
        variant="secondary"
        onPress={handleManualAddress}
        style={styles.noTopMargin}
      />
      <PrimaryButton
        title={loadingLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
        variant="secondary"
        onPress={handleLocation}
      />

      <Text style={styles.section}>👤 Contacto</Text>
      {contact ? <Text style={styles.value}>{describeContact(contact)}</Text> : null}
      <PrimaryButton title="Elegir contacto" variant="secondary" onPress={handleChooseContact} />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>📅 Agregar al calendario del dispositivo</Text>
        <Switch value={addToCalendar} onValueChange={setAddToCalendar} />
      </View>

      <PrimaryButton
        title={saving ? 'Guardando...' : 'Guardar evento'}
        onPress={handleSave}
        style={styles.save}
      />

      <ContactPickerModal
        visible={contactsVisible}
        contacts={contacts}
        onSelect={(c) => {
          setContact({ name: c.name, phone: c.phone });
          setContactsVisible(false);
        }}
        onClose={() => setContactsVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 48 },
  label: { marginBottom: 6, color: colors.text },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 18 },
  value: { color: colors.muted, marginTop: 6 },
  addressInput: { marginTop: 10, marginBottom: 0 },
  noTopMargin: { marginTop: 8 },
  preview: { width: '100%', height: 180, borderRadius: 10, marginTop: 8 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  switchLabel: { flex: 1, color: colors.text, fontSize: 15, marginRight: 12 },
  save: { marginTop: 24 },
});
