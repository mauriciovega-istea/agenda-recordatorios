import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme';

export default function ContactPickerModal({ visible, contacts, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleSelect = (contact) => {
    setQuery('');
    onSelect(contact);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Elegir contacto</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre"
          value={query}
          onChangeText={setQuery}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No se encontraron contactos.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
              <Text style={styles.name}>{item.name}</Text>
              {item.phone ? <Text style={styles.phone}>{item.phone}</Text> : null}
            </TouchableOpacity>
          )}
        />
        <PrimaryButton title="Cancelar" variant="secondary" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: colors.text },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  phone: { fontSize: 14, color: colors.muted, marginTop: 2 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },
});
