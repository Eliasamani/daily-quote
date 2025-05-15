// src/components/Quote.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { speakQuote } from "../utils/tts";
import AuthRequiredModal from "./AuthRequiredModal";

export interface QuoteCardProps {
  quote: string;
  author: string;
  isAuth: boolean;
  liked: boolean;
  saved: boolean;
  likeCount: number;
  commentCount: number;
  onLike: (event: GestureResponderEvent) => void;
  onComment: (event: GestureResponderEvent) => void;
  onSave: (event: GestureResponderEvent) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  author,
  isAuth,
  liked,
  saved,
  likeCount,
  commentCount,
  onLike,
  onComment,
  onSave,
}) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const hitSlopArea = { top: 8, bottom: 8, left: 8, right: 8 };

  const requireLogin = (action: string) => {
    const msg = `Please log in to ${action}.`;
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else if (Platform.OS === "web") {
      setLoginModalVisible(true);
    } else {
      Alert.alert("Login required", msg, [{ text: "OK" }]);
    }
  };

  // Colors
  const heartColor = isAuth ? (liked ? "red" : "#555") : "#ccc";
  const commentColor = isAuth ? "#555" : "#ccc";
  const bookmarkColor = isAuth ? (saved ? "#007AFF" : "#555") : "#ccc";
  const countColor = isAuth ? "#555" : "#ccc";
  const ttsColor = "#555"; // always enabled

  // Handlers
  const handleLike = (e: GestureResponderEvent) =>
    isAuth ? onLike(e) : requireLogin("like quotes");
  const handleComment = (e: GestureResponderEvent) =>
    isAuth ? onComment(e) : requireLogin("comment on quotes");
  const handleSave = (e: GestureResponderEvent) =>
    isAuth ? onSave(e) : requireLogin("save quotes");
  const handleSpeak = () => speakQuote(`“${quote}” — ${author}`);

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.quoteText} accessibilityRole="text">
          “{quote}”
        </Text>
        <Text style={styles.authorText} accessibilityRole="text">
          — {author}
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={handleLike}
            hitSlop={hitSlopArea}
            accessibilityRole="button"
            accessibilityLabel={`${likeCount} likes`}
          >
            <View style={styles.actionButton}>
              <FontAwesome
                name={liked ? "heart" : "heart-o"}
                size={20}
                color={heartColor}
              />
              <Text style={[styles.actionText, { color: countColor }]}>
                {likeCount}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={handleComment}
            hitSlop={hitSlopArea}
            accessibilityRole="button"
            accessibilityLabel={`${commentCount} comments`}
          >
            <View style={styles.actionButton}>
              <FontAwesome name="comment-o" size={20} color={commentColor} />
              <Text style={[styles.actionText, { color: countColor }]}>
                {commentCount}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={handleSave}
            hitSlop={hitSlopArea}
            accessibilityRole="button"
            accessibilityLabel={saved ? "Saved" : "Save"}
          >
            <FontAwesome
              name={saved ? "bookmark" : "bookmark-o"}
              size={20}
              color={bookmarkColor}
            />
          </Pressable>
          <Pressable
            onPress={handleSpeak}
            hitSlop={hitSlopArea}
            accessibilityRole="button"
            accessibilityLabel="Read quote aloud"
          >
            <FontAwesome name="volume-up" size={20} color={ttsColor} />
          </Pressable>
        </View>
      </View>
      <AuthRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 8,
    color: "#333",
  },
  authorText: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#555",
  },
});

export default QuoteCard;
