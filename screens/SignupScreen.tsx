import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

// ✅ Define Navigation Type for TypeScript
type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

function SignupScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [uid, setUid] = useState(''); // ✅ New UID Field (Unique Police ID)
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  // ✅ Validation Function
  const validateInputs = () => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number validation

    if (!fullName || !uid || !phone || !password) {
      Alert.alert('Error', 'All fields are required!');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number!');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long!');
      return false;
    }
    return true;
  };

  // ✅ Handle Signup API Call
  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true); // Show loader while signing up
    try {
      const response = await axios.post('http://172.20.10.7:8000/auth/signup', {
        full_name: fullName,
        uid,
        phone,
        password,
      });

      setLoading(false);
      Alert.alert('Success!', 'Account created successfully!');
      navigation.replace('Login');

    } catch (error: any) {
      setLoading(false);
      console.error('Signup Error:', error.response?.data || error.message);
      Alert.alert('Signup Failed!', error.response?.data?.detail || 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Circular Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../Asset/Used/police.png')} style={styles.logo} />
      </View>

      {/* Full Name Field */}
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#333" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#999"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* UID Field (Unique ID of Police) */}
      <View style={styles.inputContainer}>
        <FontAwesome name="id-badge" size={20} color="#333" style={styles.icon} />
        <TextInput
          placeholder="Police UID Number"
          placeholderTextColor="#999"
          style={styles.input}
          value={uid}
          onChangeText={setUid}
        />
      </View>

      {/* Phone Number Field */}
      <View style={styles.inputContainer}>
        <FontAwesome name="phone" size={20} color="#333" style={styles.icon} />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Password Field */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#333" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signupText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Login Redirect */}
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3C72', // ✅ Police Blue Theme
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // ✅ Circular Logo Container
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes it circular
    backgroundColor: 'white', // Optional: Background color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5, // Adds shadow for better visibility
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50, // Ensures the image is also circular
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // ✅ White Background for Inputs
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#D32F2F', // ✅ Red Button for Signup
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff', // ✅ White text for better visibility
  },
  loginLink: {
    color: '#FFD700', // ✅ Gold Highlight for Login Link
    fontWeight: 'bold',
  },
});

// ✅ Only One Default Export
export default SignupScreen;
