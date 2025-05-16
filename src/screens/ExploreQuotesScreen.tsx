// src/screens/ExploreQuotesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import CheckBox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  fetchQuoteMeta,
  toggleLike,
  toggleSave,
} from "../store/slices/quoteMetaSlice";
import { saveQuote, unsaveQuote } from "../store/slices/savedQuotesSlice";
import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import CommentsModal from "../components/CommentsModal";
import AuthRequiredModal from "../components/AuthRequiredModal";
import { useExploreQuotesPresenter } from "../presenters/ExploreQuotesPresenter";
import type { Quote } from "../models/ExploreQuotesModel";

export default function ExploreQuotesScreen() {
  const dispatch = useAppDispatch();
  const {
    guest,
    uid,
    onAuthButtonPress,
    onLogoPress,
    search,
    setSearch,
    genre,
    setGenre,
    onSearchPress,
    onRandomQuotePress,
    tags,
    quotes,
    isLoading,
    searchByAuthor,
    toggleSearchByAuthor,
  } = useExploreQuotesPresenter();

  const metaEntities = useAppSelector((s) => s.quoteMeta.entities);

  const [commentModalQuoteId, setCommentModalQuoteId] = useState<string | null>(
    null
  );
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const requireLogin = () => {
    if (Platform.OS === "web") {
      setLoginModalVisible(true);
    } else {
      Alert.alert("Login required", "Please log in to use this feature.", [
        { text: "OK" },
      ]);
    }
  };

  const handleLikePress = (id: string) => {
    if (guest) {
      requireLogin();
    } else {
      dispatch(toggleLike({ id, userId: uid }));
    }
  };

  const handleCommentPress = (id: string) => {
    if (guest) {
      requireLogin();
    } else {
      setCommentModalQuoteId(id);
    }
  };

  const handleSavePress = (item: Quote, alreadySaved: boolean) => {
    if (guest) {
      requireLogin();
      return;
    }
    // first toggle in-memory meta
    dispatch(toggleSave({ id: item.id, userId: uid }));
    // then persist
    if (!alreadySaved) {
      dispatch(saveQuote(item));
    } else {
      dispatch(unsaveQuote(item.id));
    }
  };

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
          placeholder={
            searchByAuthor ? "Search for authors..." : "Search for quotes..."
          }
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.checker}>
          <Text style={styles.checkboxLabel}>Search by author</Text>
          <CheckBox
            value={searchByAuthor}
            onValueChange={toggleSearchByAuthor}
            style={styles.checkbox}
          />
        </View>

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
          <Pressable style={styles.searchButton} onPress={onSearchPress}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
          <Pressable
            style={styles.randomizeButton}
            onPress={onRandomQuotePress}
          >
            <Text style={styles.randomizeButtonText}>Randomize Quote</Text>
          </Pressable>
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
                    isAuth={!guest}
                    liked={liked}
                    saved={saved}
                    likeCount={m.likeCount}
                    commentCount={m.commentCount}
                    onLike={() => handleLikePress(item.id)}
                    onComment={() => handleCommentPress(item.id)}
                    onSave={() => handleSavePress(item, saved)}
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

      <AuthRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  randomizeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 175,
    marginLeft: "auto",
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  checker: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-end",
  },
  checkboxLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 175,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  randomizeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: "auto",
  },
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
  loader: { marginTop: 30 },
  emptyText: { textAlign: "center", marginTop: 30, color: "#666" },
  cardWrapper: { marginBottom: 8 },
});
