// src/screens/ExploreQuotesScreen.tsx

import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchQuoteMeta,
  toggleLike,
  addComment,
  toggleSave,
  QuoteMeta,
} from "../store/slices/quoteMetaSlice";
import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import { useExploreQuotesPresenter } from "../presenters/ExploreQuotesPresenter";

export default function ExploreQuotesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    guest,
    onAuthButtonPress,
    onLogoPress,
    search,
    setSearch,
    genre,
    setGenre,
    minLength,
    setMinLength,
    maxLength,
    setMaxLength,
    onSearchPress,
    onRandomQuotePress,
    tags,
    quotes,
    isLoading,
  } = useExploreQuotesPresenter();

  // grab our metadata from Redux
  const metaEntities = useSelector(
    (s: RootState) => s.quoteMeta?.entities ?? {}
  );
  const uid = useSelector((s: RootState) => s.auth.user?.uid);

  // whenever we get new quotes, ensure their meta is loaded
  useEffect(() => {
    quotes.forEach((q) => {
      if (!metaEntities[q.id]) {
        dispatch(fetchQuoteMeta(q.id));
      }
    });
  }, [quotes, metaEntities, dispatch]);

  return (
    <View style={styles.container}>
      <Header
        title="Explore Quotes"
        onLogoPress={onLogoPress}
        authButtonText={guest ? "Login" : "Logout"}
        onAuthButtonPress={onAuthButtonPress}
      />

      <View style={styles.content}>
        {/* Search input */}
        <TextInput
          style={styles.input}
          placeholder="Search for quotes..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Genre picker */}
        <View style={styles.row}>
          <Text style={styles.label}>Genre:</Text>
          <Picker
            selectedValue={genre}
            style={styles.picker}
            onValueChange={(val) => setGenre(val)}
          >
            <Picker.Item key="all" label="All" value="" />
            {tags.map((tag) => (
              <Picker.Item key={tag.id} label={tag.name} value={tag.name} />
            ))}
          </Picker>
        </View>

        {/* Length filters */}
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

        {/* Search & Random buttons */}
        <View style={styles.row}>
          <Button title="Search" onPress={onSearchPress} />
          <TouchableOpacity onPress={onRandomQuotePress}>
            <Text style={styles.randomQuote}>…or fetch a random quote</Text>
          </TouchableOpacity>
        </View>

        {/* Quotes list */}
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <FlatList
            data={quotes}
            keyExtractor={(q) => q.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No quotes found. Try different criteria.
              </Text>
            }
            renderItem={({ item }) => {
              const m: QuoteMeta = metaEntities[item.id] || {
                id: item.id,
                likeCount: 0,
                likedBy: [],
                commentCount: 0,
                savedBy: [],
              };
              const liked = uid ? m.likedBy.includes(uid) : false;
              const saved = uid ? m.savedBy.includes(uid) : false;

              return (
                <View style={styles.cardWrapper}>
                  <QuoteCard
                    quote={item.content}
                    author={item.author}
                    liked={liked}
                    saved={saved}
                    likeCount={m.likeCount}
                    commentCount={m.commentCount}
                    onLike={() => dispatch(toggleLike(item.id))}
                    onComment={() => {
                      const text = prompt("Enter comment:");
                      if (text)
                        dispatch(addComment({ quoteId: item.id, text }));
                    }}
                    onSave={() => dispatch(toggleSave(item.id))}
                  />
                </View>
              );
            }}
          />
        )}
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
  loader: { marginTop: 30 },
  emptyText: { textAlign: "center", marginTop: 30, color: "#666" },
  cardWrapper: { marginBottom: 8 },
});
