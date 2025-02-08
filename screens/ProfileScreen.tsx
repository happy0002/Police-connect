import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<
    { uri: string; duration: number; uploading: boolean }[]
  >([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording]);

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "You need to allow microphone access.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setTimer(0);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Could not start recording.");
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordings((prev) => [
        ...prev,
        { uri: uri as string, duration: timer, uploading: false },
      ]);
      setRecording(null);
      setTimer(0);
      Alert.alert("Recording Saved", `File saved at: ${uri}`);
    } catch (error) {
      console.error("Stopping error:", error);
      Alert.alert("Error", "Failed to stop recording.");
    }
  }

  async function playRecording(uri: string, index: number) {
    try {
      if (!uri) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, volume: 1.0 }
      );

      setSound(sound);
      setIsPlaying(index);

      await sound.setVolumeAsync(1.0);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(null);
          sound.unloadAsync();
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Playback error:", error);
      Alert.alert("Error", "Failed to play recording.");
    }
  }

  async function uploadRecording(uri: string, index: number) {
    try {
      setRecordings((prev) =>
        prev.map((rec, idx) =>
          idx === index ? { ...rec, uploading: true } : rec
        )
      );

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        Alert.alert("Upload Failed", "File not found.");
        return;
      }

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: `recording-${Date.now()}.mp3`,
        type: "audio/mp3",
      } as any);

      await axios.post(
        "https://your-backend-url.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Upload Success", "Your file has been uploaded.");
      setRecordings((prev) =>
        prev.map((rec, idx) =>
          idx === index ? { ...rec, uploading: false } : rec
        )
      );
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Failed", "Could not upload the file.");
      setRecordings((prev) =>
        prev.map((rec, idx) =>
          idx === index ? { ...rec, uploading: false } : rec
        )
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>

      <Text style={styles.timer}>
        {recording ? `Recording: ${timer}s` : "Not Recording"}
      </Text>

      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.recordingItem}>
            <Text style={styles.recordingText}>
              Recording {index + 1} - {item.duration}s
            </Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playRecording(item.uri, index)}
              disabled={isPlaying === index}
            >
              <Ionicons
                name={isPlaying === index ? "pause-circle" : "play-circle"}
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => uploadRecording(item.uri, index)}
              disabled={item.uploading}
            >
              {item.uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Ionicons name="cloud-upload" size={26} color="white" />
              )}
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={startRecording}
          disabled={recording !== null}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopRecording}
          disabled={recording === null}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#1976D2" },
  timer: { fontSize: 16, color: "#D32F2F", marginBottom: 20 },
  recordingItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", padding: 10, borderRadius: 8, backgroundColor: "#E3F2FD", marginBottom: 10 },
  buttonContainer: { position: "absolute", bottom: 30, flexDirection: "row", justifyContent: "space-between", width: "80%" },
  button: { flex: 1, paddingVertical: 10, marginHorizontal: 8, borderRadius: 8, alignItems: "center" },
  startButton: { backgroundColor: "#4CAF50" },
  stopButton: { backgroundColor: "#D32F2F" },
  uploadButton: { backgroundColor: "#FFA500", padding: 8, borderRadius: 8 },
  playButton: { backgroundColor: "#388E3C", padding: 8, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ProfileScreen;
