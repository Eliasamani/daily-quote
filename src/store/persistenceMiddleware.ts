// src/store/persistenceMiddleware.ts
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { createQuote } from "./slices/createdQuotesSlice";
import { saveQuoteWithData, deleteSavedQuote } from "./slices/savedQuotesSlice";
import { toggleLike, toggleSave, addComment } from "./slices/quoteMetaSlice";
import * as persistence from "../../firebasePersistence";

const persistenceListener = createListenerMiddleware();

// New quote
persistenceListener.startListening({
  actionCreator: createQuote,
  effect: async ({ payload }) => {
    await persistence.persistNewQuote(payload.content, payload.author);
  },
});

// Save / Unsave full quote
persistenceListener.startListening({
  actionCreator: saveQuoteWithData,
  effect: async ({ payload }) => {
    await persistence.saveQuoteWithData(payload);
  },
});
persistenceListener.startListening({
  actionCreator: deleteSavedQuote,
  effect: async ({ payload }) => {
    await persistence.deleteSavedQuote(payload);
  },
});

// Toggle like / save / comment
persistenceListener.startListening({
  actionCreator: toggleLike,
  effect: async ({ payload }) => {
    await persistence.toggleLikeInFirestore(payload);
  },
});
persistenceListener.startListening({
  actionCreator: toggleSave,
  effect: async ({ payload }) => {
    await persistence.toggleSaveInFirestore(payload);
  },
});
persistenceListener.startListening({
  actionCreator: addComment,
  effect: async ({ payload }) => {
    await persistence.addCommentInFirestore(payload.quoteId, payload.text);
  },
});

export default persistenceListener;
