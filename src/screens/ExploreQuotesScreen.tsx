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
  Platform,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "../store/store";
import {
  fetchQuoteMeta,
  toggleLike,
  toggleSave,
} from "../store/slices/quoteMetaSlice";
import {
  saveQuoteWithData,
  unsaveQuoteWithData,
} from "../store/slices/savedQuotesSlice";
import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import CommentsModal from "../components/CommentsModal";
import { useExploreQuotesPresenter } from "../presenters/ExploreQuotesPresenter";
import type { Quote } from "../models/ExploreQuotesModel";

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

  // Helper to prompt login
  const requireLogin = (action: string) => {
    const msg = `Please log in to ${action}.`;
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert("Login required", msg, [{ text: "OK" }]);
    }
  };

  // ——— Handlers pulled out of nested ternaries ———
  const handleLikePress = (id: string) => {
    if (guest) {
      requireLogin("like quotes");
    } else {
      dispatch(toggleLike(id));
    }
  };

  const handleCommentPress = (id: string) => {
    if (guest) {
      requireLogin("comment on quotes");
    } else {
      setCommentModalQuoteId(id);
    }
  };

  const handleSavePress = (item: Quote, alreadySaved: boolean) => {
    if (guest) {
      requireLogin("save quotes");
      return;
    }
    // Toggle public metadata
    dispatch(toggleSave(item.id));
    // Snapshot or delete full-data
    if (!alreadySaved) {
      dispatch(saveQuoteWithData(item));
    } else {
      dispatch(unsaveQuoteWithData(item.id));
    }
  };

  // Ensure metadata is loaded
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
            {tags.map((t) => (
              <Picker.Item key={t.id} label={t.name} value={t.name} />
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
              const m = metaEntities[item.id] || {
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
                    onLike={() => handleLikePress(item.id)}
                    onComment={() => handleCommentPress(item.id)}
                    onSave={() => handleSavePress(item, saved)}
                    disabled={guest}
                  />
                </View>
              );
            }}
          />
        )}

        {commentModalQuoteId && (
          <CommentsModal
            quoteId={commentModalQuoteId}
            visible
            onClose={() => setCommentModalQuoteId(null)}
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
