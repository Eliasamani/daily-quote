// src/screens/SavedQuotesScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useAppDispatch, RootState } from "../store/store";
import { useSelector } from "react-redux";
import { toggleLike } from "../store/slices/quoteMetaSlice";
import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import { useSavedQuotesPresenter } from "../presenters/SavedQuotesPresenter";
import type { QuoteMeta } from "../store/slices/quoteMetaSlice";
import type { Quote } from "../models/ExploreQuotesModel";

export default function SavedQuotesScreen() {
  const dispatch = useAppDispatch();
  const {
    onLogout,
    onLogoPress,
    quotes,
    isLoading,
    onUnsave,
    metaEntities,
    uid,
  } = useSavedQuotesPresenter();

  // Handler for like button
  const handleLikePress = (quoteId: string) => {
    dispatch(toggleLike(quoteId));
  };

  // Determine content based on loading and data state
  let content: React.ReactNode;
  if (isLoading) {
    content = <ActivityIndicator size="large" />;
  } else if (quotes.length === 0) {
    content = (
      <Text style={styles.emptyText}>You haven’t saved any quotes yet.</Text>
    );
  } else {
    content = (
      <FlatList
        data={quotes}
        keyExtractor={(q: Quote) => q.id}
        renderItem={({ item }) => {
          // Load metadata for this quote
          const meta: QuoteMeta = metaEntities[item.id] || {
            id: item.id,
            likeCount: 0,
            likedBy: [],
            commentCount: 0,
            savedBy: [],
          };
          const liked = uid ? meta.likedBy.includes(uid) : false;

          return (
            <View style={styles.cardWrapper}>
              <QuoteCard
                quote={item.content}
                author={item.author}
                liked={liked}
                saved={true}
                likeCount={meta.likeCount}
                commentCount={meta.commentCount}
                onLike={() => handleLikePress(item.id)}
                onComment={() => {
                  /* Optional comment modal here */
                }}
                onSave={() => onUnsave(item.id)}
              />
            </View>
          );
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Saved Quotes"
        onLogoPress={onLogoPress}
        authButtonText="Logout"
        onAuthButtonPress={onLogout}
      />
      <View style={styles.content}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1, padding: 16 },
  emptyText: {
    flex: 1,
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 18,
  },
  cardWrapper: { marginBottom: 8 },
});
