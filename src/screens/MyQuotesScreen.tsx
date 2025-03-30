import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import { useMyQuotesPresenter } from "../presenters/MyQuotesPresenter";

export default function MyQuotesScreen() {
  const { onLogout, onLogoPress } = useMyQuotesPresenter();

  return (
    <View style={styles.container}>
      <Header
        title="My Quotes"
        onLogoPress={onLogoPress}
        authButtonText="Logout"
        onAuthButtonPress={onLogout}
      />
      <View style={styles.content}>
        <Text style={styles.description}>Quotes that you have created.</Text>
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
