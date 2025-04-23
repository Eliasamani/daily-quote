import { Tag } from "../store/slices/quote"; // Adjust path as needed

// API endpoints
const API_BASE_URL = "https://api.quotable.kurokeita.dev/api";

// Types
export interface Quote {
  _id: string;
  content: string;
  author: string;
  genre?: string;
  tags?: string[];
}

interface SearchParams {
  query?: string;
  genre?: string;
  minLength?: number;
  maxLength?: number;
}

export class ExploreQuotesModel {
  // Fetch all quotes (first page for now)
  static async getQuotes(): Promise<Quote[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/quotes?limit=10`);
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }
  }

  static async getTags(): Promise<Tag[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) throw new Error("Failed to fetch tags");
      return await response.json();
    } catch (error) {
      console.error("Error fetching tags:", error);
      return [];
    }
  }

  // Search with filters
  static async searchQuotes(params: SearchParams): Promise<Quote[]> {
    try {
      const query = new URLSearchParams();

      if (params.query) query.append("query", params.query);
      if (params.genre) query.append("tags", params.genre); // API uses `tags`
      if (params.minLength)
        query.append("minLength", params.minLength.toString());
      if (params.maxLength)
        query.append("maxLength", params.maxLength.toString());

      query.append("limit", "25"); // Add a reasonable limit

      const response = await fetch(
        `${API_BASE_URL}/quotes?${query.toString()}`
      );
      if (!response.ok) throw new Error("Failed to search quotes");
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching quotes:", error);
      return [];
    }
  }

  // Fetch a random quote
  static async getRandomQuote(): Promise<Quote | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/quotes/random`);
      if (!response.ok) throw new Error("Failed to fetch random quote");
      
      const quote = await response.json();
      console.log("Random quote API response:", quote);
      
      // Create a properly formatted quote object with safer property access
      return {
        _id: quote._id || String(Math.random()),
        content: quote.content,
        // Handle author being either a string or an object with a name property
        author: typeof quote.author === 'object' ? 
          (quote.author?.name || "Unknown") : 
          (quote.author || "Unknown"),
          tags: quote.tags || []
      };
    } catch (error) {
      console.error("Error fetching random quote:", error);
      return null;
    }
  }

  // Save favorite (stub since real API needs auth backend)
  static async saveQuote(quoteId: string, token: string): Promise<boolean> {
    try {
      console.log(`Quote ${quoteId} saved to favorites (mock implementation)`);
      return true;
    } catch (error) {
      console.error("Error saving quote:", error);
      return false;
    }
  }
}
