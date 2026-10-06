import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { formStyles as styles } from './formStyles';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await login(username, password);
    if (!result.ok) Alert.alert('Error', result.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Agenda</Text>
      <TextInput style={styles.input} placeholder="Usuario" autoCapitalize="none" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <PrimaryButton title="Ingresar" onPress={handleLogin} />
      <PrimaryButton title="Crear cuenta" variant="secondary" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
