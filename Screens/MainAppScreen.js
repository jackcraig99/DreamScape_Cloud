import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from './firebaseConfig'; // Import auth

const MainAppScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are logged in!</Text>
      {/* This button will log the user out */}
      <Button title="Logout" onPress={() => auth.signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default MainAppScreen;