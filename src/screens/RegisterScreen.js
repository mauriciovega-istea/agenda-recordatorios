import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { formStyles as styles } from './formStyles';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    const result = await register(username, password);
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
