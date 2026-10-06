import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

export default function EventItem({ event, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>
          {`${event.date} · ${event.time} hs`}
        </Text>
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
  info: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', color: colors.text },
  date: { fontSize: 14, color: colors.muted, marginTop: 4 },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  deleteText: { color: colors.danger, fontWeight: '600' },
});
