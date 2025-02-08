import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

// Define navigation type
type RootStackParamList = {
  Splash: undefined;
  Signup: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

// ✅ Define the function as a constant before export
const SplashScreen = ({ navigation }: Props) => {
  
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Signup'); // Navigate to Signup after 3 seconds
    }, 3000);
  }, []);

  return (
    <LinearGradient colors={['#1E3C72', '#2A5298']} style={styles.container}>
      {/* Circular Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../Asset/Used/police.png')} style={styles.logo} />
      </View>

      {/* Title and Subtitle */}
      <Text style={styles.title}>पंजाब पुलिस</Text>  
      <Text style={styles.subtitle}>उत्तम गुणवत्ता, बेहतरीन विकल्प</Text>  

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <Image source={require('../Asset/Used/made-in-india.png')} style={styles.madeInIndiaLogo} />
        <Text style={styles.madeInIndiaText}>मेड इन इंडिया</Text>
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      </View>
    </LinearGradient>
  );
};

// ✅ Ensure only one `export default`
export default SplashScreen;

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55, // Makes it a perfect circle
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // More space between logo and text
  },
  logo: {
    width: 95,
    height: 95,
    borderRadius: 47.5, // Ensures image fits inside the circular container
    resizeMode: 'contain',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  madeInIndiaLogo: {
    width: 100, // Increased for better visibility
    height: 60,
    resizeMode: 'contain',
  },
  madeInIndiaText: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  loader: {
    marginTop: 10,
  },
});
