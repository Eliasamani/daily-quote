import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import { useCreateQuotesPresenter } from "../presenters/CreateQuotesPresenter";

export default function CreateQuotesScreen() {
  const { onLogout, onLogoPress } = useCreateQuotesPresenter();

  return (
    <View style={styles.container}>
      <Header
        title="Create Quotes"
        onLogoPress={onLogoPress}
        authButtonText="Logout"
        onAuthButtonPress={onLogout}
      />
      <View style={styles.content}>
        <Text style={styles.description}>
          Create your own inspiring quotes.
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
