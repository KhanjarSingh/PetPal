import React, { useState } from "react";
import { Platform } from "react-native";
import { BASE_URL } from "../config";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = BASE_URL;

  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSignUp = async () => {
    if (isLoading) return;
    setIsLoading(true);
    console.log("Attempting to sign up with:", { fullName, email });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });
      console.log("Sign up response status:", response.status);
      const data = await response.json();
      console.log("Sign up response data:", data);
      if (response.ok) {
        Alert.alert("Success", data.message);
        if (isMounted.current) setIsLogin(true);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    console.log("Attempting to log in with:", { email });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);
      if (response.ok && data.token) {
        // Store token in AsyncStorage for API calls
        await AsyncStorage.setItem('userToken', String(data.token));
        console.log("Login successful, calling onLoginSuccess");
        onLoginSuccess({ ...data.user, token: data.token });
      } else {
        Alert.alert("Login Failed", data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>
              {isLogin ? "Login" : "Create an Account"}
            </Text>

            {!isLogin && (
              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            )}

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity
              // style={styles.button}
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={isLogin ? handleLogin : handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? "Login" : "Sign Up"}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Text
                style={styles.toggleButton}
                onPress={isLoading ? undefined : toggleForm}
              >
                {" "}
                {isLogin ? "Sign Up" : "Login"}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1D4ED8",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: "#A5B4FC" },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  toggleText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 16,
    color: "#6B7280",
  },
  toggleButton: { color: "#1D4ED8", fontWeight: "600" },
});
