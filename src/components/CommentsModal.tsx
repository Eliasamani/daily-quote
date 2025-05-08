// src/components/CommentsModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { db } from "../config/firebase"; // ← your initialized firebase/app + firestore
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

import { useAppDispatch } from "../store/store";
import { addComment } from "../store/slices/quoteMetaSlice";

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Timestamp;
}

interface CommentsModalProps {
  quoteId: string;
  visible: boolean;
  onClose: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  quoteId,
  visible,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!visible) return;

    const commentsRef = collection(db, "quoteMeta", quoteId, "comments");
    const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snap: QuerySnapshot) => {
        const list = snap.docs.map((docSnap: QueryDocumentSnapshot) => {
          const data = docSnap.data() as Omit<Comment, "id">;
          return { id: docSnap.id, ...data };
        });
        setComments(list);
      },
      (err) => {
        console.error("Comments listener error:", err);
      }
    );

    return () => unsubscribe();
  }, [quoteId, visible]);

  const send = () => {
    if (!text.trim()) return;
    dispatch(addComment({ quoteId, text: text.trim() }));
    setText("");
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.header}>
        <Text style={styles.title}>Comments</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(c) => c.id}
        contentContainerStyle={comments.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No comments yet. Be the first to comment!
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentMeta}>
              by {item.userId} ·{" "}
              {item.createdAt && item.createdAt.toDate
                ? item.createdAt.toDate().toLocaleString()
                : "Sending..."}
            </Text>
          </View>
        )}
        
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment…"
          value={text}
          onChangeText={setText}
        />
        <Button title="Send" onPress={send} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  close: { color: "blue" },

  // Comments list
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#666",
  },
  comment: { marginBottom: 12, paddingHorizontal: 16 },
  commentText: { fontSize: 16 },
  commentMeta: { fontSize: 12, color: "#666" },

  // Input row
  inputRow: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 12,
  },
});

export default CommentsModal;
