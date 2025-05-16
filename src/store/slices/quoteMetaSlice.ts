// src/store/slices/quoteMetaSlice.ts
import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";

export interface QuoteMeta {
  id: string;
  likeCount: number;
  likedBy: string[];
  commentCount: number;
  savedBy: string[];
}

interface QuoteMetaState {
  entities: Record<string, QuoteMeta>;
}

const initialMetaState: QuoteMetaState = {
  entities: {},
};

// Plain action to request fetching metadata
export const fetchQuoteMeta = createAction<string>("quoteMeta/fetchQuoteMeta");

const quoteMetaSlice = createSlice({
  name: "quoteMeta",
  initialState: initialMetaState,
  reducers: {
    setMeta(state, action: PayloadAction<QuoteMeta>) {
      state.entities[action.payload.id] = action.payload;
    },
    toggleLike(state, action: PayloadAction<{ id: string; userId: string }>) {
      const { id, userId } = action.payload;
      const m = state.entities[id];
      if (m) {
        if (m.likedBy.includes(userId)) {
          m.likedBy = m.likedBy.filter((u) => u !== userId);
        } else {
          m.likedBy.unshift(userId);
        }
        m.likeCount = m.likedBy.length;
      }
    },
    addComment(
      state,
      action: PayloadAction<{
        quoteId: string;
        commentId: string;
        text: string;
        userId: string;
      }>
    ) {
      const { quoteId } = action.payload;
      const m = state.entities[quoteId];
      if (m) m.commentCount++;
    },
    toggleSave(state, action: PayloadAction<{ id: string; userId: string }>) {
      const { id, userId } = action.payload;
      const m = state.entities[id];
      if (m) {
        if (m.savedBy.includes(userId)) {
          m.savedBy = m.savedBy.filter((u) => u !== userId);
        } else {
          m.savedBy.unshift(userId);
        }
      }
    },
  },
});

export const { setMeta, toggleLike, addComment, toggleSave } =
  quoteMetaSlice.actions;
export default quoteMetaSlice.reducer;
