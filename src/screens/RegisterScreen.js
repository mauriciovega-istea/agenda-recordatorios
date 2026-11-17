import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuthStore } from '../store/useAuthStore';
import { formStyles as styles } from './formStyles';

export default function RegisterScreen({ navigation }) {
  const register = useAuthStore((state) => state.register);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = () => {
    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    const result = register(username, password);
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    Alert.alert('Listo', 'Cuenta creada. Ya podés iniciar sesión.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <TextInput style={styles.input} placeholder="Usuario" autoCapitalize="none" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Repetir contraseña" secureTextEntry value={confirm} onChangeText={setConfirm} />
      <PrimaryButton title="Registrarme" onPress={handleRegister} />
    </View>
  );
}
