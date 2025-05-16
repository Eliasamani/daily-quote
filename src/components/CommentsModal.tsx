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
  Alert,
} from "react-native";

import { db } from "../config/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useAppDispatch, useAppSelector } from "../store/store";
import { addComment as addCommentAction } from "../store/slices/quoteMetaSlice";

export interface Comment {
  id: string;
  userId: string;
  username?: string;
  text: string;
  createdAt: Timestamp | null;
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
  const dispatch = useAppDispatch();
  const uid = useAppSelector((s) => s.auth.user?.uid);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  // Listen for comments in Firestore
  useEffect(() => {
    if (!visible) return;

    const commentsRef = collection(db, "quoteMeta", quoteId, "comments");
    const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snap: QuerySnapshot) => {
        const list = snap.docs.map((docSnap: QueryDocumentSnapshot) => {
          const data = docSnap.data() as Omit<Comment, "id">;
          return {
            id: docSnap.id,
            userId: data.userId,
            username: data.username,
            text: data.text,
            createdAt: data.createdAt ?? null,
          };
        });
        setComments(list);
      },
      (err) => {
        console.error("Comments listener error:", err);
      }
    );

    return () => unsubscribe();
  }, [quoteId, visible]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!uid) {
      Alert.alert("Login required", "You must be logged in to comment.");
      return;
    }

    // Fetch username for this uid
    let username = "Unknown";
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (typeof data.username === "string") {
          username = data.username;
        }
      }
    } catch (err) {
      console.warn("Could not fetch username:", err);
    }

    // Dispatch action; middleware will write to Firestore
    dispatch(
      addCommentAction({
        quoteId,
        text: trimmed,
        userId: uid,
        username,
      })
    );

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
              by {item.username} ·{" "}
              {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleString()
                : "Sending…"}
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
