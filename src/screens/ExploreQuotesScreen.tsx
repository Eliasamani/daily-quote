import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import { useExploreQuotesPresenter } from "../presenters/ExploreQuotesPresenter";

export default function ExploreQuotesScreen() {
  const { guest, onAuthButtonPress, onLogoPress } = useExploreQuotesPresenter();

  return (
    <View style={styles.container}>
      <Header
        title="Explore Quotes"
        onLogoPress={onLogoPress}
        authButtonText={guest ? "Login" : "Logout"}
        onAuthButtonPress={onAuthButtonPress}
      />
      <View style={styles.content}>
        <Text style={styles.description}>
          Browse inspiring quotes from around the world.
        </Text>
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
  description: { fontSize: 18, textAlign: "center" },
});
