// src/screens/MyQuotesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/store";
import { toggleLike, toggleSave } from "../store/slices/quoteMetaSlice";
import { saveQuote, unsaveQuote } from "../store/slices/savedQuotesSlice";
import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import CommentsModal from "../components/CommentsModal";
import { useMyQuotesPresenter } from "../presenters/MyQuotesPresenter";
import type { Quote } from "../models/ExploreQuotesModel";
import type { QuoteMeta } from "../store/slices/quoteMetaSlice";

export default function MyQuotesScreen() {
  const dispatch = useAppDispatch();
  const {
    onLogout,
    onLogoPress,
    myQuotes,
    isLoading,
    metaEntities,
    uid,
    guest,
  } = useMyQuotesPresenter();

  const [commentVisible, setCommentVisible] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  const handleLike = (id: string) => {
    if (!uid) return;
    dispatch(toggleLike({ id, userId: uid }));
  };

  const handleSave = (item: Quote, saved: boolean) => {
    if (!uid) return;
    // update metadata
    dispatch(toggleSave({ id: item.id, userId: uid }));
    // write to Firestore
    if (saved) {
      dispatch(unsaveQuote(item.id));
    } else {
      dispatch(saveQuote(item));
    }
  };

  const handleComment = (id: string) => {
    setActiveQuoteId(id);
    setCommentVisible(true);
  };

  let content: React.ReactNode;
  if (isLoading) {
    content = <ActivityIndicator size="large" />;
  } else if (myQuotes.length === 0) {
    content = (
      <Text style={styles.emptyText}>You haven’t created any quotes yet.</Text>
    );
  } else {
    content = (
      <FlatList
        data={myQuotes}
        keyExtractor={(q: Quote) => q.id}
        renderItem={({ item }) => {
          const meta: QuoteMeta = metaEntities[item.id] ?? {
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
                onLike={() => handleLike(item.id)}
                onComment={() => handleComment(item.id)}
                onSave={() => handleSave(item, saved)}
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
        title="My Quotes"
        onLogoPress={onLogoPress}
        authButtonText="Logout"
        onAuthButtonPress={onLogout}
      />
      <View style={styles.content}>{content}</View>
      {activeQuoteId && (
        <CommentsModal
          quoteId={activeQuoteId}
          visible={commentVisible}
          onClose={() => setCommentVisible(false)}
        />
      )}
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
