// src/components/QuoteCard.tsx
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export interface QuoteCardProps {
  quote: string;
  author: string;
  liked?: boolean;
  saved?: boolean;
  likeCount?: number;
  commentCount?: number;
  onLike?: (event: GestureResponderEvent) => void;
  onComment?: (event: GestureResponderEvent) => void;
  onSave?: (event: GestureResponderEvent) => void;
  /** when true, all actions are shown as disabled (grayed out) */
  disabled?: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  author,
  liked = false,
  saved = false,
  likeCount = 0,
  commentCount = 0,
  onLike,
  onComment,
  onSave,
  disabled = false,
}) => {
  const hitSlopArea = { top: 8, bottom: 8, left: 8, right: 8 };

  // If disabled, show grey; else normal
  const heartColor = disabled ? "#ccc" : liked ? "red" : "#555";
  const commentColor = disabled ? "#ccc" : "#555";
  const bookmarkColor = disabled ? "#ccc" : saved ? "#007AFF" : "#555";
  const textColor = disabled ? "#ccc" : "#555";

  return (
    <View style={styles.card}>
      <Text style={styles.quoteText} accessibilityRole="text">
        “{quote}”
      </Text>
      <Text style={styles.authorText} accessibilityRole="text">
        — {author}
      </Text>
      <View style={styles.actions}>
        <Pressable
          onPress={onLike}
          hitSlop={hitSlopArea}
          accessibilityLabel={`${likeCount} likes`}
          accessibilityRole="button"
        >
          <View style={styles.actionButton}>
            <Icon
              name={liked ? "heart" : "heart-o"}
              size={20}
              color={heartColor}
            />
            <Text style={[styles.actionText, { color: textColor }]}>
              {likeCount}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onComment}
          hitSlop={hitSlopArea}
          accessibilityLabel={`${commentCount} comments`}
          accessibilityRole="button"
        >
          <View style={styles.actionButton}>
            <Icon name="comment-o" size={20} color={commentColor} />
            <Text style={[styles.actionText, { color: textColor }]}>
              {commentCount}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onSave}
          hitSlop={hitSlopArea}
          accessibilityLabel={saved ? "Saved" : "Save"}
          accessibilityRole="button"
        >
          <Icon
            name={saved ? "bookmark" : "bookmark-o"}
            size={20}
            color={bookmarkColor}
          />
        </Pressable>
      </View>
    </View>
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
    // default color; overridden inline when disabled
    color: "#555",
  },
});

export default QuoteCard;
