import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import type { Quote } from "../../models/ExploreQuotesModel";

export const fetchSavedQuotes = createAction<string>(
  "savedQuotes/fetchSavedQuotes"
);

interface SavedQuotesState {
  entities: Record<string, Quote>;
  ids: string[];
}

const initialState: SavedQuotesState = {
  entities: {},
  ids: [],
};

const savedQuotesSlice = createSlice({
  name: "savedQuotes",
  initialState,
  reducers: {
    setSavedQuotes: (state, action: PayloadAction<Quote[]>) => {
      state.entities = {};
      state.ids = [];
      for (const q of action.payload) {
        state.entities[q.id] = q;
        state.ids.push(q.id);
      }
    },
    saveQuote: (state, action: PayloadAction<Quote>) => {
      const q = action.payload;
      state.entities[q.id] = q;
      if (!state.ids.includes(q.id)) state.ids.push(q.id);
    },
    unsaveQuote: (state, action: PayloadAction<string>) => {
      delete state.entities[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { setSavedQuotes, saveQuote, unsaveQuote } =
  savedQuotesSlice.actions;
export default savedQuotesSlice.reducer;
