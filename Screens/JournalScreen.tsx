import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Define the structure of a dream object for TypeScript
interface Dream {
  id: string;
  transcription: string;
  status: 'processing' | 'completed' | 'error';
  createdAt: {
    toDate: () => Date;
  };
}

const JournalScreen = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure there is a logged-in user before trying to fetch data
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const userId = auth.currentUser.uid;
    const dreamsCollectionRef = collection(db, 'users', userId, 'dreams');
    const q = query(dreamsCollectionRef, orderBy('createdAt', 'desc'));

    // onSnapshot listens for real-time updates from Firestore
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dreamsData: Dream[] = [];
      querySnapshot.forEach((doc) => {
        dreamsData.push({ id: doc.id, ...doc.data() } as Dream);
      });
      setDreams(dreamsData);
      setLoading(false);
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  const renderDreamItem = ({ item }: { item: Dream }) => {
    let content;
    switch (item.status) {
      case 'completed':
        content = <Text style={styles.transcription}>{item.transcription}</Text>;
        break;
      case 'processing':
        content = <Text style={styles.statusText}>Transcribing...</Text>;
        break;
      case 'error':
        content = <Text style={styles.statusText}>Transcription failed.</Text>;
        break;
      default:
        content = null;
    }

    return (
      <View style={styles.dreamItem}>
        <Text style={styles.date}>
          {item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'No date'}
        </Text>
        {content}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <FlatList
      data={dreams}
      renderItem={renderDreamItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<Text style={styles.emptyText}>You haven't recorded any dreams yet.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  dreamItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  transcription: {
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    color: '#aaa',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default JournalScreen;
