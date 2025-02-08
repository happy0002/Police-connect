import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Audio } from "expo-av";

export default function ProfileScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<
    { uri: string; duration: number }[]
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

  // ✅ Start Recording
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

  // ✅ Stop Recording and Save it
  async function stopRecording() {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordings((prev) => [...prev, { uri: uri as string, duration: timer }]);
      setRecording(null);
      setTimer(0);
      Alert.alert("Recording Saved", `File saved at: ${uri}`);
    } catch (error) {
      console.error("Stopping error:", error);
      Alert.alert("Error", "Failed to stop recording.");
    }
  }

  // ✅ Play Selected Recording
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>

      {/* ⏳ Timer Display */}
      <Text style={styles.timer}>
        {recording ? `Recording: ${timer}s` : "Not Recording"}
      </Text>

      {/* 📜 List of Recorded Audios */}
      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.recordingItem}>
            <Text style={styles.recordingText}>
              Recording {index + 1} - {item.duration}s
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.playButton]}
              onPress={() => playRecording(item.uri, index)}
              disabled={isPlaying === index}
            >
              <Text style={styles.buttonText}>
                {isPlaying === index ? "Playing..." : "Play"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🎙️ Buttons at the Bottom */}
      <View style={styles.buttonContainer}>
        {/* 🎤 Start Recording Button */}
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={startRecording}
          disabled={recording !== null}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        {/* ⏹ Stop Recording Button */}
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

// ✅ Updated Styles
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
    marginBottom: 20,
  },
  recordingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
    marginBottom: 10,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  playButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#1976D2",
  },
  stopButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
