import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";

export interface QuoteMeta {
  id: string;
  likeCount: number;
  likedBy: string[];
  commentCount: number;
  savedBy: string[];
}

export const fetchQuoteMeta = createAction<string>("quoteMeta/fetchQuoteMeta");

interface QuoteMetaState {
  entities: Record<string, QuoteMeta>;
  ids: string[];
}

const initialState: QuoteMetaState = {
  entities: {},
  ids: [],
};

const quoteMetaSlice = createSlice({
  name: "quoteMeta",
  initialState,
  reducers: {
    setMeta: (state, action: PayloadAction<QuoteMeta>) => {
      const meta = action.payload;
      state.entities[meta.id] = meta;
      if (!state.ids.includes(meta.id)) state.ids.push(meta.id);
    },
    toggleLike: (
      state,
      action: PayloadAction<{ id: string; userId: string }>
    ) => {
      const { id, userId } = action.payload;
      const meta = state.entities[id];
      if (!meta) return;
      const idx = meta.likedBy.indexOf(userId);
      if (idx > -1) meta.likedBy.splice(idx, 1);
      else meta.likedBy.push(userId);
      meta.likeCount = meta.likedBy.length;
    },
    toggleSave: (
      state,
      action: PayloadAction<{ id: string; userId: string }>
    ) => {
      const { id, userId } = action.payload;
      const meta = state.entities[id];
      if (!meta) return;
      const idx = meta.savedBy.indexOf(userId);
      if (idx > -1) meta.savedBy.splice(idx, 1);
      else meta.savedBy.push(userId);
    },
    addComment: (
      state,
      action: PayloadAction<{
        quoteId: string;
        text: string;
        userId: string;
      }>
    ) => {
      const meta = state.entities[action.payload.quoteId];
      if (!meta) return;
      meta.commentCount += 1;
    },
  },
});

export const { setMeta, toggleLike, toggleSave, addComment } =
  quoteMetaSlice.actions;
export default quoteMetaSlice.reducer;
