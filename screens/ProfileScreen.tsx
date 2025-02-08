import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Audio } from "expo-av";

export default function ProfileScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // ✅ Start Recording Function
  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "You need to allow microphone access.");
        return;
      }

      // ✅ Stop any existing recording before starting a new one
      if (recording) {
        await stopRecording();
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

  // ✅ Stop Recording Function
  async function stopRecording() {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      Alert.alert("Recording Saved", `File saved at: ${uri}`);
      console.log("Recording saved at:", uri);
    } catch (error) {
      console.error("Stopping error:", error);
      Alert.alert("Error", "Failed to stop recording.");
    }
  }

  // ✅ Play Recorded Audio with Maximum Volume
  async function playRecording() {
    try {
      if (!recordingUri) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true, volume: 1.0 } // ✅ Maximum Volume
      );

      setSound(sound);
      setIsPlaying(true);

      // ✅ Ensure Volume is Set to Maximum
      await sound.setVolumeAsync(1.0);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Playback error:", error);
      Alert.alert("Error", "Failed to play recording.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>

      {/* ⏳ Timer Display */}
      <Text style={styles.timer}>{recording ? `Recording: ${timer}s` : "Not Recording"}</Text>

      {/* 🎙️ Start Recording Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1976D2" }]}
        onPress={startRecording}
        disabled={recording !== null}
      >
        <Text style={styles.buttonText}>Start Recording</Text>
      </TouchableOpacity>

      {/* ⏹ Stop Recording Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#D32F2F" }]}
        onPress={stopRecording}
        disabled={recording === null}
      >
        <Text style={styles.buttonText}>Stop Recording</Text>
      </TouchableOpacity>

      {/* ▶ Play Recording Button (Appears After Recording is Saved) */}
      {recordingUri && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isPlaying ? "#9E9E9E" : "#388E3C" }]}
          onPress={playRecording}
          disabled={isPlaying}
        >
          <Text style={styles.buttonText}>{isPlaying ? "Playing..." : "Play Recording"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1976D2",
  },
  timer: {
    fontSize: 18,
    color: "#D32F2F",
    marginBottom: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
