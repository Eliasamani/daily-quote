import { Tag } from "../store/slices/quote";

const API_BASE_URL = "https://api.quotable.kurokeita.dev/api";

export interface Quote {
  id: string;
  content: string;
  author: string;
  genre?: string;
  tags?: string[];
}

export interface SearchParams {
  query?: string;
  tag?: string;
  author?: string;
  minLength?: number;
  maxLength?: number;
}

export class ExploreQuotesModel {
  static async getQuotes(limit = 25): Promise<Quote[]> {
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
      }));
    } catch (err) {
      console.error("Error fetching quotes:", err);
      return [];
    }
  }

  static async getTags(): Promise<Tag[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) throw new Error("Failed to fetch tags");
      return await response.json();
    } catch (err) {
      console.error("Error fetching tags:", err);
      return [];
    }
  }

  static async searchQuotes(params: SearchParams): Promise<Quote[]> {
    try {
      const query = new URLSearchParams();
      if (params.query) query.append("query", params.query);
      if (params.tag) query.append("tag", params.tag);
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
      return [];
    }
  }

  static async getRandomQuote(params: { 
    tag?: string, 
    author?: string, 
    genre?: string 
  } = {}): Promise<Quote | null> {
    try {
      // Construct query parameters
      const query = new URLSearchParams();
      
      // Add optional filters if provided
      if (params.tag) query.append('tags', params.tag);
      if (params.author) query.append('author', params.author);
      if (params.genre) query.append('genre', params.genre);
      
      // Always get a random quote
      const url = `${API_BASE_URL}/quotes/random?${query.toString()}`;
      
      console.log("Random quote request URL:", url);
  
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch random quote");
      
      const data = await response.json();
      console.log("Random quote API full response:", data);
  
      // Extract the quote from the nested structure
      const quote = data.quote || data;
      
      return {
        id: quote.id,
        content: quote.content,
        // Handle author object or string
        author: quote.author?.name || quote.author || "Unknown",
        // Handle tags array from nested structure
        tags: quote.tags?.map((tag: any) => 
          typeof tag === 'object' ? tag.name : tag
        ) || [],
        // Include genre if available
        genre: quote.genre || (quote.tags?.[0]?.name)
      };
    } catch (error) {
      console.error("Error fetching random quote:", error);
      // Additional detailed logging
      console.error("Error details:", {
        name: error instanceof Error ? error.name : 'Unknown Error',
        message: error instanceof Error ? error.message : 'No message',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      return null;
    }
  }

  static async saveQuote(quoteId: string, token: string): Promise<boolean> {
    console.log(`Quote ${quoteId} saved to favorites (mock)`);
    return true;
  }

  /** Fetch a single quote by its ID */
  static async getQuoteById(id: string): Promise<Quote | null> {
    try {
      const url = `${API_BASE_URL}/quotes?id=${encodeURIComponent(id)}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch quote ${id}: ${response.status}`);
      const data = await response.json();

      // The API returns an object with a `results` array (or raw array)
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
      return null;
    }
  }
}