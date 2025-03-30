import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import { useSavedQuotesPresenter } from "../presenters/SavedQuotesPresenter";

export default function SavedQuotesScreen() {
  const { onLogout, onLogoPress } = useSavedQuotesPresenter();

  return (
    <View style={styles.container}>
      <Header
        title="Saved Quotes"
        onLogoPress={onLogoPress}
        authButtonText="Logout"
        onAuthButtonPress={onLogout}
      />
      <View style={styles.content}>
        <Text style={styles.description}>
          Your saved quotes will appear here.
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
