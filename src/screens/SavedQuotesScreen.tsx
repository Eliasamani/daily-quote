// src/screens/SavedQuotesScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import CommentsModal from "../components/CommentsModal";
import { useSavedQuotesPresenter } from "../presenters/SavedQuotesPresenter";
import type { Quote } from "../models/ExploreQuotesModel";

export default function SavedQuotesScreen() {
  const {
    guest,
    onLogout,
    onLogoPress,
    quotes,
    isLoading,
    activeQuoteId,
    commentVisible,
    setCommentVisible,
    metaEntities,
    uid,
    showComments,
    onLike,
    onUnsave,
  } = useSavedQuotesPresenter();

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
          const meta = metaEntities[item.id] ?? {
            id: item.id,
            likeCount: 0,
            likedBy: [],
            commentCount: 0,
            savedBy: [],
          };
          const liked = uid ? meta.likedBy.includes(uid) : false;
          const saved = uid ? meta.savedBy.includes(uid) : false;

          return (
            <View style={styles.cardWrapper}>
              <QuoteCard
                quote={item.content}
                author={item.author}
                isAuth={!guest}
                liked={liked}
                saved={saved}
                likeCount={meta.likeCount}
                commentCount={meta.commentCount}
                onLike={() => onLike(item.id)}
                onComment={() => showComments(item.id)}
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
      <CommentsModal
        quoteId={activeQuoteId!}
        visible={commentVisible}
        onClose={() => setCommentVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1, padding: 16 },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 18,
  },
  cardWrapper: { marginBottom: 8 },
});
