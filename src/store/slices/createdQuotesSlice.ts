// src/store/slices/createdQuotesSlice.ts
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface CreatedQuote {
  id: string;
  content: string;
  author: string;
  createdAt: number;
}

interface CreatedQuotesState {
  entities: Record<string, CreatedQuote>;
}

const initialCreatedState: CreatedQuotesState = {
  entities: {},
};

const createdQuotesSlice = createSlice({
  name: "createdQuotes",
  initialState: initialCreatedState,
  reducers: {
    addQuote: {
      reducer(state, action: PayloadAction<CreatedQuote>) {
        state.entities[action.payload.id] = action.payload;
      },
      prepare(content: string, author: string) {
        return {
          payload: {
            id: nanoid(),
            content,
            author,
            createdAt: Date.now(),
          },
        };
      },
    },
  },
});

export const { addQuote } = createdQuotesSlice.actions;
export default createdQuotesSlice.reducer;
