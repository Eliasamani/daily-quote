import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define the API base URL
const API_BASE_URL = "https://api.quotable.kurokeita.dev/api";

// Define types
export interface Quote {
  id: string;
  content: string;
  author: string;
  genre?: string;
  tags?: string[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface SearchParams {
  query?: string;
  tag?: string;
  author?: string;
  minLength?: number;
  maxLength?: number;
}

interface ExploreQuotesState {
  quotes: Quote[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ExploreQuotesState = {
  quotes: [],
  tags: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchQuotes = createAsyncThunk(
  'exploreQuotes/fetchQuotes',
  async (limit: number = 25) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quotes?limit=${limit}`);
      if (!response.ok)
        throw new Error(`Failed to fetch quotes: ${response.status}`);
      const data = await response.json();
      console.log("Quotes API response:", data);

      const raw = Array.isArray(data) ? data : data.results || data.data || [];

      return raw.map((q: any) => ({
        id: q.id,
        content: q.content,
        author: typeof q.author === "string" ? q.author : q.author.name,
        length: q.content.length,
        tags: Array.isArray(q.tags) ? q.tags : [],
        genre: q.genre || (q.tags?.[0]?.name ?? undefined),
      }));
    } catch (err) {
      console.error("Error fetching quotes:", err);
      throw err;
    }
  }
);

export const fetchTags = createAsyncThunk(
  'exploreQuotes/fetchTags',
  async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) throw new Error("Failed to fetch tags");
      return await response.json();
    } catch (err) {
      console.error("Error fetching tags:", err);
      throw err;
    }
  }
);

export const searchQuotes = createAsyncThunk(
  'exploreQuotes/searchQuotes',
  async (params: SearchParams) => {
    try {
      const query = new URLSearchParams();
      if (params.query) query.append("query", params.query);
      if (params.tag) query.append("tags", params.tag);
      if (params.author) query.append("author", params.author);
      if (params.minLength) query.append("minLength", params.minLength.toString());
      if (params.maxLength) query.append("maxLength", params.maxLength.toString());
      query.append("limit", "25");

      const url = `${API_BASE_URL}/quotes?${query.toString()}`;
      console.log("Search URL:", url);

      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to search quotes: ${response.status}`);
      const data = await response.json();
      console.log("Search API response:", data);

      const raw = Array.isArray(data) ? data : data.results || data.data || [];

      return raw.map((q: any) => ({
        id: q.id,
        content: q.content,
        author: typeof q.author === "string" ? q.author : q.author.name,
        length: q.content.length,
        tags: Array.isArray(q.tags) ? q.tags : [],
      }));
    } catch (err) {
      console.error("Error searching quotes:", err);
      throw err;
    }
  }
);

export const getRandomQuote = createAsyncThunk(
  'exploreQuotes/getRandomQuote',
  async (params: { tag?: string, author?: string, genre?: string } = {}) => {
    try {

      const query = new URLSearchParams();
      

      if (params.tag) query.append('tags', params.tag);
      if (params.author) query.append('author', params.author);
      if (params.genre) query.append('genre', params.genre);

      const url = `${API_BASE_URL}/quotes/random?${query.toString()}`;
      
      console.log("Random quote request URL:", url);
  
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch random quote");
      
      const data = await response.json();
      console.log("Random quote API full response:", data);
  

      const quote = data.quote || data;
      
      return {
        id: quote.id,
        content: quote.content,
        author: quote.author?.name || quote.author || "Unknown",
        tags: quote.tags?.map((tag: any) => 
          typeof tag === 'object' ? tag.name : tag
        ) || [],
      };
    } catch (error) {
      console.error("Error fetching random quote:", error);
      throw error;
    }
  }
);

export const getQuoteById = createAsyncThunk(
  'exploreQuotes/getQuoteById',
  async (id: string) => {
    try {
      const url = `${API_BASE_URL}/quotes?id=${encodeURIComponent(id)}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch quote ${id}: ${response.status}`);
      const data = await response.json();

      const raw: any[] = Array.isArray(data)
        ? data
        : data.results || data.data || [];

      if (raw.length === 0) return null;

      const q = raw[0];
      return {
        id: q._id ?? q.id,
        content: q.content,
        author: typeof q.author === "string" ? q.author : q.author.name,
        tags: Array.isArray(q.tags) ? q.tags : [],
      };
    } catch (err) {
      console.error("Error fetching quote by ID:", err);
      throw err;
    }
  }
);

const exploreQuotesSlice = createSlice({
  name: 'exploreQuotes',
  initialState,
  reducers: {
    resetQuotes: (state) => {
      state.quotes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action: PayloadAction<Quote[]>) => {
        state.loading = false;
        state.quotes = action.payload;
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quotes';
      })
      
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tags';
      })
      
      .addCase(searchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchQuotes.fulfilled, (state, action: PayloadAction<Quote[]>) => {
        state.loading = false;
        state.quotes = action.payload;
      })
      .addCase(searchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search quotes';
      })
      
      .addCase(getRandomQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRandomQuote.fulfilled, (state, action: PayloadAction<Quote>) => {
        state.loading = false;
        state.quotes = action.payload ? [action.payload] : [];
      })
      .addCase(getRandomQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch random quote';
      })
      
      .addCase(getQuoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuoteById.fulfilled, (state, action: PayloadAction<Quote | null>) => {
        state.loading = false;
        if (action.payload) {
          const exists = state.quotes.some(q => q.id === action.payload?.id);
          if (!exists && action.payload) {
            state.quotes.push(action.payload);
          }
        }
      })
      .addCase(getQuoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quote by ID';
      });
  },
});

export const { resetQuotes } = exploreQuotesSlice.actions;
export default exploreQuotesSlice.reducer;