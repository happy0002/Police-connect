import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Define the function as a constant before export
const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const [selectedStatus, setSelectedStatus] = useState("On Duty");

  // ✅ Handle Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Logged Out", "You have been logged out successfully!");
    navigation.replace("Login"); // Redirect to Login screen
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔙 Header Section */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* 👮‍♂️ Profile Info */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../Asset/Used/police.png")} // Police image
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Ajmal</Text>
            <Text style={styles.profileRole}>Punjab Police Officer</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={22} color="orange" />
          </TouchableOpacity>
        </View>

        {/* 🚔 Horizontally Scrollable Status Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusBadge,
              selectedStatus === "On Duty" && styles.selectedStatusBadge,
              { backgroundColor: "#4CAF50" },
            ]}
            onPress={() => setSelectedStatus("On Duty")}
          >
            <Text style={styles.statusText}>🚔 On Duty</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusBadge,
              selectedStatus === "Investigating" && styles.selectedStatusBadge,
              { backgroundColor: "#FFD700" },
            ]}
            onPress={() => setSelectedStatus("Investigating")}
          >
            <Text style={styles.statusText}>🕵️ Investigating</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusBadge,
              selectedStatus === "Off Duty" && styles.selectedStatusBadge,
              { backgroundColor: "#E57373" },
            ]}
            onPress={() => setSelectedStatus("Off Duty")}
          >
            <Text style={styles.statusText}>🚨 Off Duty</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ⚖️ Profile Options (Punjab Police Related) */}
        <View style={styles.menuContainer}>
          {/* Achievements */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Image
                source={require("../Asset/Used/medal.png")} // Achievement icon
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Medals & Achievements</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="gray" />
          </TouchableOpacity>

          {/* Privacy */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Image
                source={require("../Asset/Used/shield.png")} // Privacy icon
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Security & Privacy</Text>
            </View>
            <View style={styles.menuRight}>
              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>Action Required</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="gray" />
            </View>
          </TouchableOpacity>

          {/* Log Out */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <Image
                source={require("../Asset/Used/police.png")} // Logout icon
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="gray" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ Ensure only one `export default`
export default SettingsScreen;

// ✅ Styles
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 14,
    color: "gray",
  },
  statusContainer: {
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    marginRight: 10,
  },
  selectedStatusBadge: {
    backgroundColor: "#D4E4F1",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 25,
    height: 25,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeRed: {
    backgroundColor: "#F9C0C0",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
