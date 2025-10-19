import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// Import Firebase modules
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { auth } from '../firebaseConfig'; // Make sure this path is correct

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [isUploading, setIsUploading] = useState(false); // State for upload indicator

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    setIsRecording(true);
    await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      return;
    });
  };

  const onStopRecord = async () => {
    const localUri = await audioRecorderPlayer.stopRecorder();
    setIsRecording(false);
    audioRecorderPlayer.removeRecordBackListener();
    setRecordTime('00:00:00');
    console.log('Recording stopped. File is at:', localUri);

    // --- Start of New Upload Logic ---
    uploadAudio(localUri); 
  };
  
  const uploadAudio = async (localUri) => {
    setIsUploading(true); // Show the loading indicator
    
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in!");
        setIsUploading(false);
        return;
    }

    try {
        // Create a unique filename for the dream audio
        const dreamId = `${new Date().getTime()}.mp4`;
        const storagePath = `users/${user.uid}/audio/${dreamId}`;

        // Convert the local file URI to a blob
        const response = await fetch(localUri);
        const blob = await response.blob();

        // Get a reference to the storage location
        const storage = getStorage();
        const storageRef = ref(storage, storagePath);

        // Upload the blob
        await uploadBytes(storageRef, blob);

        console.log('Upload successful!');
        alert('Dream uploaded successfully!');

    } catch (error) {
        console.error("Upload failed:", error);
        alert('Upload failed. Please try again.');
    } finally {
        setIsUploading(false); // Hide the loading indicator
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{recordTime}</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? onStopRecord : onStartRecord}
        disabled={isUploading} // Disable button while uploading
      />
      {isUploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading dream...</Text>
        </View>
      )}
       <Button title="Logout" onPress={() => auth.signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  timerText: {
    fontSize: 40,
    marginBottom: 20,
  },
  uploadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  }
});

export default RecordScreen;
