// At the top of the file, import the auth object
import { auth } from './firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
// You will need to set up Firebase config and import this
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
  if (email === '' || password === '') {
    setError('Email and password cannot be empty.');
    return;
  }
  try {
    setError(''); // Clear previous errors
    await createUserWithEmailAndPassword(auth, email, password);
    // On success, the onAuthStateChanged listener (in App.js) will automatically
    // navigate the user to the main app screen.
  } catch (e) {
    // Handle specific errors
    if (e.code === 'auth/email-already-in-use') {
      setError('That email address is already in use!');
    } else if (e.code === 'auth/invalid-email') {
      setError('That email address is invalid!');
    } else {
      setError('An error occurred during sign up.');
    }
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

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

export default SignUpScreen;