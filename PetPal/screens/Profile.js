import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PETS_API_URL } from "../config";

export default function Profile({ user, navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        // Example: fetch user profile from backend (adjust endpoint as needed)
        const res = await fetch("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.user || data);
      } catch (err) {
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          if (user && typeof user.logout === "function") {
            user.logout();
          } else if (navigation && navigation.reset) {
            navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="person-circle-outline" size={80} color="#2196F3" />
      <Text style={styles.title}>User Profile</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2196F3"
          style={{ marginTop: 24 }}
        />
      ) : error ? (
        <Text style={styles.text}>{error}</Text>
      ) : profile ? (
        <>
          <Text style={styles.text}>
            Name: {profile.name || profile.fullName}
          </Text>
          <Text style={styles.text}>Email: {profile.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>User data not available.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginTop: 10, fontWeight: "bold" },
  text: { fontSize: 16, marginTop: 8 },
  logoutButton: {
    marginTop: 24,
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: { color: "white", fontWeight: "600" },
});
