import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import { useExploreQuotesPresenter } from "../presenters/ExploreQuotesPresenter";
import { Picker } from "@react-native-picker/picker"; // npm install this if not installed

export default function ExploreQuotesScreen() {
  const {
    guest,
    onAuthButtonPress,
    onLogoPress,
    search,
    genre,
    setGenre,
    minLength,
    maxLength,
    setMinLength,
    setMaxLength,
    onSearchPress,
    onRandomQuotePress,
    quotes,
  } = useExploreQuotesPresenter();

  return (
    <View style={styles.container}>
      <Header
        title="Explore Quotes"
        onLogoPress={onLogoPress}
        authButtonText={guest ? "Login" : "Logout"}
        onAuthButtonPress={onAuthButtonPress}
      />

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Search for quotes..."
          value={search}
          onChangeText={(text) => setSearch(text)}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Genre:</Text>
          <Picker
            selectedValue={genre}
            style={styles.picker}
            onValueChange={(itemValue) => setGenre(itemValue)}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Inspirational" value="inspirational" />
            <Picker.Item label="Wisdom" value="wisdom" />
            {/* Add more genres */}
          </Picker>
        </View>

        <View style={styles.row}>
          <TextInput
            style={styles.lengthInput}
            placeholder="Min Length"
            keyboardType="numeric"
            value={minLength}
            onChangeText={setMinLength}
          />
          <Text style={styles.to}>to</Text>
          <TextInput
            style={styles.lengthInput}
            placeholder="Max Length"
            keyboardType="numeric"
            value={maxLength}
            onChangeText={setMaxLength}
          />
        </View>

        <View style={styles.row}>
          <Button title="Search" onPress={onSearchPress} />
          <TouchableOpacity onPress={onRandomQuotePress}>
            <Text style={styles.randomQuote}>...or fetch a random quote</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.tableHeader}>Quote</Text>
          <Text style={styles.tableHeader}>Author</Text>
          <Text style={styles.tableHeader}>Length</Text>
        </View>

        <FlatList
          data={quotes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.quoteRow}>
              <Text style={styles.cell}>{item.content}</Text>
              <Text style={styles.cell}>{item.author}</Text>
              <Text style={styles.cell}>{item.length}</Text>
            </View>
          )}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1, padding: 16 },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: { marginRight: 8 },
  picker: { flex: 1, height: 40 },
  lengthInput: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  to: { marginHorizontal: 4 },
  randomQuote: {
    marginLeft: 12,
    color: "blue",
    textDecorationLine: "underline",
  },
  listHeader: {
    flexDirection: "row",
    backgroundColor: "#999",
    padding: 8,
    marginTop: 12,
  },
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
  },
  quoteRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: { flex: 1 },
  footer: {
    backgroundColor: "#a98888",
    padding: 12,
    alignItems: "center",
  },
  footerText: { color: "#fff" },
});
