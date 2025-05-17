// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { useHomePresenter } from "../presenters/HomePresenter";

export default function HomeScreen() {
  const { guest, onAuthButtonPress, onNavigateToDashboard } =
    useHomePresenter();

  return (
    <View style={styles.container}>
      <Header
        title="DailyQuote Home"
        onLogoPress={onNavigateToDashboard}
        authButtonText={guest ? "Login" : "Logout"}
        onAuthButtonPress={onAuthButtonPress}
      />
      <View style={styles.content}>
        <Text style={styles.description}>
          Welcome to DailyQuote! Discover, create, and save inspiring quotes.
        </Text>
        <TouchableOpacity style={styles.button} onPress={onNavigateToDashboard}>
          <Text style={styles.buttonText}>Explore App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  description: { fontSize: 18, textAlign: "center", marginBottom: 32 },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
