// src/screens/CreateQuotesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Platform,
} from "react-native";
import Header from "../components/Header";
import { useCreateQuotesPresenter } from "../presenters/CreateQuotesPresenter";

export default function CreateQuotesScreen() {
  const { onLogout, onLogoPress, submitQuote, guest } =
    useCreateQuotesPresenter();
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");

  const onSubmit = () => {
    if (guest) {
      const msg = "Please log in to create quotes.";
      if (Platform.OS === "android") {
        // Android toast or fallback to alert
        Alert.alert(msg);
      } else {
        Alert.alert("Login required", msg);
      }
      return;
    }

    if (!quote.trim() || !author.trim()) {
      Alert.alert("Please provide both quote text and author.");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    submitQuote(quote.trim(), author.trim(), tagsArray);

    // Clear inputs
    setQuote("");
    setAuthor("");
    setTags("");
  };

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
        <TextInput
          style={styles.input}
          placeholder="Enter quote"
          value={quote}
          onChangeText={setQuote}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter author"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter tags (comma separated)"
          value={tags}
          onChangeText={setTags}
        />
        <Button title="Submit Quote" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1, padding: 16, justifyContent: "center" },
  description: { fontSize: 18, textAlign: "center", marginBottom: 16 },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
});
