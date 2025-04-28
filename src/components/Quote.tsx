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
  /** The text of the quote */
  quote: string;
  /** The author of the quote */
  author: string;
  /** Whether the quote is liked */
  liked?: boolean;
  /** Whether the quote is saved */
  saved?: boolean;
  /** Number of likes */
  likeCount?: number;
  /** Number of comments */
  commentCount?: number;
  /** Callback for like action */
  onLike?: (event: GestureResponderEvent) => void;
  /** Callback for comment action */
  onComment?: (event: GestureResponderEvent) => void;
  /** Callback for save action */
  onSave?: (event: GestureResponderEvent) => void;
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
}) => {
  const hitSlopArea = { top: 8, bottom: 8, left: 8, right: 8 };
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
              color={liked ? "red" : "#555"}
            />
            <Text style={styles.actionText}>{likeCount}</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onComment}
          hitSlop={hitSlopArea}
          accessibilityLabel={`${commentCount} comments`}
          accessibilityRole="button"
        >
          <View style={styles.actionButton}>
            <Icon name="comment-o" size={20} color="#555" />
            <Text style={styles.actionText}>{commentCount}</Text>
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
            color={saved ? "#007AFF" : "#555"}
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
    color: "#555",
  },
});

export default QuoteCard;
