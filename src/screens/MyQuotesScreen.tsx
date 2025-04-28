import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { useAppDispatch } from "../store/store";
import { toggleLike, toggleSave } from "../store/slices/quoteMetaSlice";
import {
  saveQuoteWithData,
  unsaveQuoteWithData,
} from "../store/slices/savedQuotesSlice";
import Header from "../components/Header";
import QuoteCard from "../components/Quote";
import CommentsModal from "../components/CommentsModal";
import type { Quote } from "../models/ExploreQuotesModel";
import type { QuoteMeta } from "../store/slices/quoteMetaSlice";
import { useMyQuotesPresenter } from "../presenters/MyQuotesPresenter";

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
    if (guest) {
      Alert.alert("Login required", "Please log in to like quotes.");
    } else {
      dispatch(toggleLike(id));
    }
  };

  const handleSave = (item: Quote, saved: boolean) => {
    if (guest) {
      Alert.alert("Login required", "Please log in to save quotes.");
      return;
    }
    dispatch(toggleSave(item.id));
    saved
      ? dispatch(unsaveQuoteWithData(item.id))
      : dispatch(saveQuoteWithData(item));
  };

  const handleComment = (id: string) => {
    if (guest) {
      Alert.alert("Login required", "Please log in to comment.");
    } else {
      setActiveQuoteId(id);
      setCommentVisible(true);
    }
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
          const meta: QuoteMeta = metaEntities[item.id] || {
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
                liked={liked}
                saved={saved}
                likeCount={meta.likeCount}
                commentCount={meta.commentCount}
                onLike={() => handleLike(item.id)}
                onComment={() => handleComment(item.id)}
                onSave={() => handleSave(item, saved)}
                disabled={guest}
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
