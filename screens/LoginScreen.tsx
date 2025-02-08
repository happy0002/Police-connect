import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

// ✅ Define Navigation Type
type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

// ✅ API BASE URL (Ensure http:// is included)
const BASE_URL = "http://172.20.10.7:8000"; // Replace with your actual local IP

// ✅ LoginScreen Component
const LoginScreen = ({ navigation }: Props) => {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Handle Login with FastAPI Backend
  const handleLogin = async () => {
    Keyboard.dismiss(); // Hide keyboard when login is clicked

    if (!uid || !password) {
      Alert.alert('Error', 'Please enter both UID and Password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { uid, password });

      // ✅ If login is successful, save token & navigate
      await AsyncStorage.setItem('token', response.data.token || 'dummy-token'); // Modify if token is returned
      Alert.alert('Login Successful', 'Welcome back!');
      navigation.replace('MainApp'); // ✅ Redirect to MainApp
    } catch (error: any) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.response?.data?.detail || 'Invalid UID or Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // ✅ iOS uses "padding"
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
          {/* 🏅 Circular Image Section */}
          <View style={styles.logoContainer}>
            <Image source={require('../Asset/Used/police.png')} style={styles.logo} />
          </View>

          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Enter your UID and Password</Text>

          {/* 🆔 UID Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter UID"
            value={uid}
            onChangeText={setUid}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          {/* 🔒 Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          {/* 🔘 Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// ✅ Ensure ONLY ONE Default Export
export default LoginScreen;

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3C72', // 🔵 Blue background matching Splash/Home
  },
  innerContainer: {
    flexGrow: 1, // ✅ Ensures scrollability when keyboard opens
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
