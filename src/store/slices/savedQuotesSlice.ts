// src/store/slices/savedQuotesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Quote } from "../../models/ExploreQuotesModel";

interface SavedQuotesState {
  entities: Record<string, Quote>;
}

const initialSavedState: SavedQuotesState = {
  entities: {},
};

const savedQuotesSlice = createSlice({
  name: "savedQuotes",
  initialState: initialSavedState,
  reducers: {
    saveQuote(state, action: PayloadAction<Quote>) {
      state.entities[action.payload.id] = action.payload;
    },
    unsaveQuote(state, action: PayloadAction<string>) {
      delete state.entities[action.payload];
    },
  },
});

export const { saveQuote, unsaveQuote } = savedQuotesSlice.actions;
export default savedQuotesSlice.reducer;
