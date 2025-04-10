import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import Header from "../components/Header";
import { useCreateQuotesPresenter } from "../presenters/CreateQuotesPresenter";

export default function CreateQuotesScreen() {
  const { onLogout, onLogoPress, submitQuote } = useCreateQuotesPresenter();

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!quote || !author) {
      Alert.alert("Missing fields", "Please fill in both quote and author.");
      return;
    }

    const tagArray = tags.split(",").map((t) => t.trim());
    submitQuote(quote, author, tagArray);
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
        <Text style={styles.description}>Create your own inspiring quotes.</Text>

        <TextInput
          style={styles.input}
          placeholder="Quote text"
          value={quote}
          onChangeText={setQuote}
        />
        <TextInput
          style={styles.input}
          placeholder="Author"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
        />

        <Button title="Submit Quote" onPress={handleSubmit} />
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
  },
  description: { fontSize: 18, textAlign: "center", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});
