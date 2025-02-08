import { StackNavigationProp } from '@react-navigation/stack';

// ✅ Define Navigation Structure
export type RootStackParamList = {
  Splash: undefined;
  Signup: undefined;
  Login: undefined;
  MainApp: undefined; // This is the Bottom Tab Navigator
};

// ✅ Define the Type for LoginScreen Navigation Prop
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
