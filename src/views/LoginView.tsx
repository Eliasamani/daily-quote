import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import LoginPresenter from '../presenters/LoginPresenter';

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginView({ onSwitchToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const presenter = new LoginPresenter({ onLoginSuccess: () => {}, onError: setError });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={() => presenter.login(email, password)} />
      <Text style={styles.link} onPress={onSwitchToRegister}>Don't have an account? Register</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#f9f9f9', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginVertical: 8 },
  error: { color: 'red', marginBottom: 8 },
  link: { marginTop: 12, color: '#0066cc', textAlign: 'center' },
});