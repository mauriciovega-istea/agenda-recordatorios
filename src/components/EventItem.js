import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { describeContact, describeLocation } from '../utils/eventHelpers';

export default function EventItem({ event, onDelete, onAddToCalendar }) {
  const locationText = describeLocation(event.location);
  const contactText = describeContact(event.contact);

  return (
    <View style={styles.card}>
      {event.photoUri ? (
        <Image testID={`photo-${event.id}`} source={{ uri: event.photoUri }} style={styles.photo} />
      ) : null}

      <View style={styles.info}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{`${event.date} · ${event.time} hs`}</Text>
        {locationText ? <Text style={styles.detail}>{`📍 ${locationText}`}</Text> : null}
        {contactText ? <Text style={styles.detail}>{`👤 ${contactText}`}</Text> : null}

        {event.calendarEventId ? (
          <Text style={styles.badge}>📅 En el calendario</Text>
        ) : onAddToCalendar ? (
          <TouchableOpacity testID={`calendar-${event.id}`} onPress={() => onAddToCalendar(event)}>
            <Text style={styles.link}>+ Agregar al calendario</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        testID={`delete-${event.id}`}
        accessibilityLabel="Eliminar evento"
        onPress={() => onDelete(event.id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  photo: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', color: colors.text },
  date: { fontSize: 14, color: colors.muted, marginTop: 4 },
  detail: { fontSize: 13, color: colors.muted, marginTop: 2 },
  badge: { fontSize: 13, color: colors.primary, marginTop: 6, fontWeight: '600' },
  link: { fontSize: 13, color: colors.primary, marginTop: 6, fontWeight: '600' },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  deleteText: { color: colors.danger, fontWeight: '600' },
});
