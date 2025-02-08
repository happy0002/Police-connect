import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width; // Get screen width
const screenHeight = Dimensions.get('window').height; // Get screen height

const HomeScreen = () => {
  // 🔹 Card Data (Quick Access + Law & Safety)
  const cards = [
    { id: 'knowDept', title: 'Know Dept', icon: 'business-outline' },
    { id: 'events', title: 'Calendar', icon: 'calendar-outline' },
    { id: 'complaints', title: 'Complaint', icon: 'megaphone-outline' },
    { id: 'jobs', title: 'Court', icon: 'briefcase-outline' },
    { id: 'crimePrevention', title: 'Crime Prev.', icon: 'shield-checkmark-outline' },
    { id: 'mostWanted', title: 'Most Wanted', icon: 'person-remove-outline' },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* 🎨 Enhanced Welcome Banner with Larger Image */}
        <LinearGradient colors={['#1E3C72', '#2A5298']} style={styles.banner}>
          <Image source={require('../Asset/Used/arrest.png')} style={styles.bannerImage} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Welcome!</Text>
            <Text style={styles.bannerSubtitle}>
              Connecting you to law enforcement and keeping you informed.
            </Text>
          </View>
        </LinearGradient>

        {/* 📜 Content Section */}
        <View style={styles.content}>
          {/* 🔹 Quick Access Section */}
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalContainer}>
              {cards.slice(0, 3).map((card) => (
                <TouchableOpacity key={card.id} style={styles.card}>
                  <LinearGradient colors={['#1E3C72', '#2A5298']} style={styles.cardContent}>
                    <Ionicons name={card.icon} size={32} color="#ffffff" />
                    <Text 
                      style={styles.cardText} 
                      numberOfLines={1} 
                      ellipsizeMode="tail"
                    >
                      {card.title}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* ⚖️ Law & Safety Section */}
          <Text style={styles.sectionTitle}>Law & Safety</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalContainer}>
              {cards.slice(3, 6).map((card) => (
                <TouchableOpacity key={card.id} style={styles.card}>
                  <LinearGradient colors={['#1E3C72', '#2A5298']} style={styles.cardContent}>
                    <Ionicons name={card.icon} size={32} color="#ffffff" />
                    <Text 
                      style={styles.cardText} 
                      numberOfLines={1} 
                      ellipsizeMode="tail"
                    >
                      {card.title}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 🔴 Stylish "Call Control Room" Button */}
          <TouchableOpacity style={styles.submitTip}>
            <Ionicons name="call-outline" size={28} color="#fff" />
            <Text style={styles.submitTipText}>Call Control Room</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ✅ Correct Default Export (ONLY ONE EXPORT)
export default HomeScreen;

// ✅ Styles
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  banner: {
    height: screenHeight * 0.25,
    width: '90%',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
    elevation: 10,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'left' },
  bannerSubtitle: { fontSize: 14, color: '#E3F2FD', textAlign: 'left', marginTop: 5 },
  content: { flex: 1, width: '90%', marginTop: 10 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden', // ✅ Ensures the gradient stays inside the border
    width: screenWidth * 0.32, // ✅ Increased width to ensure text fits
    height: screenWidth * 0.35, // ✅ Slightly adjusted height for better layout
    marginHorizontal: 10,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 15, // ✅ Reduced padding slightly to keep text within the box
  },
  cardText: {
    fontSize: 14,
    marginTop: 8, // ✅ Slightly adjusted margin to keep spacing clean
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
    width: '90%', // ✅ Ensures text stays inside the card
  },
  submitTip: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  submitTipText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});
