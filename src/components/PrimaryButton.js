import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';

export default function PrimaryButton({ title, onPress, variant = 'primary', style }) {
  const bg = variant === 'secondary' ? colors.card : colors.primary;
  const fg = variant === 'secondary' ? colors.primary : '#FFF';
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, { backgroundColor: bg }, variant === 'secondary' && styles.outline, style]}
    >
      <Text style={[styles.text, { color: fg }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  outline: { borderWidth: 1, borderColor: colors.primary },
  text: { fontSize: 16, fontWeight: '600' },
});
