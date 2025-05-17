import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import type { CreatedQuote } from "../../models/CreatedQuote";

export const fetchCreatedQuotes = createAction<string>(
  "createdQuotes/fetchCreatedQuotes"
);

interface CreatedQuotesState {
  entities: Record<string, CreatedQuote>;
  ids: string[];
}

const initialState: CreatedQuotesState = {
  entities: {},
  ids: [],
};

const createdQuotesSlice = createSlice({
  name: "createdQuotes",
  initialState,
  reducers: {
    setCreatedQuotes: (state, action: PayloadAction<CreatedQuote[]>) => {
      state.entities = {};
      state.ids = [];
      for (const q of action.payload) {
        state.entities[q.id] = q;
        state.ids.push(q.id);
      }
    },
    addQuote: (state, action: PayloadAction<CreatedQuote>) => {
      const q = action.payload;
      state.entities[q.id] = q;
      if (!state.ids.includes(q.id)) state.ids.push(q.id);
    },
    removeQuote: (state, action: PayloadAction<string>) => {
      delete state.entities[action.payload];
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { setCreatedQuotes, addQuote, removeQuote } =
  createdQuotesSlice.actions;
export default createdQuotesSlice.reducer;
