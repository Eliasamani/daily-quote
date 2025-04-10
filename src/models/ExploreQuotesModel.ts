import { Tag } from "../store/slices/quote"; // Adjust path as needed

// API endpoints
const API_BASE_URL = "https://api.quotable.io";

// Types
export interface Quote {
  _id: string;
  content: string;
  author: string;
  length: number;
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
      const response = await fetch(`${API_BASE_URL}/quotes?limit=20`);
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

      query.append("limit", "20"); // Add a reasonable limit

      const response = await fetch(
        `${API_BASE_URL}/quotes/search?${query.toString()}`
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
      const response = await fetch(`${API_BASE_URL}/random`);
      if (!response.ok) throw new Error("Failed to fetch random quote");
      return await response.json();
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
