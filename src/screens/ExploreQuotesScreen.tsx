// src/screens/ExploreQuotesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "../store/store";

import {
  fetchQuoteMeta,
  toggleLike,
  toggleSave,
  QuoteMeta,
} from "../store/slices/quoteMetaSlice";

import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import CommentsModal from "../components/CommentsModal";
import { useExploreQuotesPresenter } from "../presenters/ExploreQuotesPresenter";

export default function ExploreQuotesScreen() {
  const dispatch = useAppDispatch();
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

  const metaEntities = useSelector(
    (state: RootState) => state.quoteMeta.entities
  );
  const uid = useSelector((state: RootState) => state.auth.user?.uid);

  const [commentModalQuoteId, setCommentModalQuoteId] = useState<string | null>(
    null
  );

  useEffect(() => {
    quotes.forEach((q) => {
      if (!metaEntities[q.id]) {
        dispatch(fetchQuoteMeta(q.id));
      }
    });
  }, [quotes, metaEntities, dispatch]);

  // Helpers to block guest actions
  const requireLogin = (action: string) => {
    Alert.alert("Login required", `You must be logged in to ${action}.`, [
      { text: "OK" },
    ]);
  };

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
          onChangeText={setSearch}
        />

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
            <Text style={styles.randomQuote}>…or fetch a random quote</Text>
          </TouchableOpacity>
        </View>

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

              // Handlers that respect guest status
              const handleLike = () =>
                guest
                  ? requireLogin("like quotes")
                  : dispatch(toggleLike(item.id));

              const handleComment = () =>
                guest
                  ? requireLogin("comment on quotes")
                  : setCommentModalQuoteId(item.id);

              const handleSave = () =>
                guest
                  ? requireLogin("save quotes")
                  : dispatch(toggleSave(item.id));

              return (
                <View style={styles.cardWrapper}>
                  <QuoteCard
                    quote={item.content}
                    author={item.author}
                    liked={liked}
                    saved={saved}
                    likeCount={m.likeCount}
                    commentCount={m.commentCount}
                    onLike={handleLike}
                    onComment={handleComment}
                    onSave={handleSave}
                  />
                </View>
              );
            }}
          />
        )}
      </View>

      {commentModalQuoteId && (
        <CommentsModal
          quoteId={commentModalQuoteId}
          visible
          onClose={() => setCommentModalQuoteId(null)}
        />
      )}
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
