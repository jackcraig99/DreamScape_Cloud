import { auth } from './firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
// You will need to set up Firebase config and import this
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async () => {
  if (email === '' || password === '') {
    setError('Email and password cannot be empty.');
    return;
  }
  try {
    setError('');
    await signInWithEmailAndPassword(auth, email, password);
    // On success, the user will be navigated to the main app screen.
  } catch (e) {
    setError('Failed to log in. Please check your credentials.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={syles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

// You can reuse the same styles from SignUpScreen or create new ones
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;