import React, { useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const user = useContext(UserContext);

  return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="person-circle-outline" size={80} color="#2196F3" />
      <Text style={styles.title}>User Profile</Text>
      {user ? (
        <>
          <Text style={styles.text}>Name: {user.fullName}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: () => {
                    try {
                      if (typeof user.logout === "function") {
                        user.logout();
                      }
                    } catch (e) {
                      console.error("Logout failed:", e);
                    }
                  },
                },
              ])
            }
          >
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
  logoutButton: { marginTop: 24, backgroundColor: "#EF4444", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  logoutText: { color: "white", fontWeight: "600" },
});
