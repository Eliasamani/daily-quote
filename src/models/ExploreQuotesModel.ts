import { Tag } from "../store/slices/quote"; // Adjust path as needed

const API_BASE_URL = "https://api.quotable.kurokeita.dev/api";

export class ExploreQuotesModel {
  static async getQuotes(limit: number = 25): Promise<Quote[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/quotes?limit=${limit}`);
      if (!response.ok) throw new Error(`Failed to fetch quotes: ${response.status}`);
      
      const data = await response.json();
      console.log("Quotes API response:", data); 
      
      if (!data || (!data.results && !Array.isArray(data))) {
        return [];
      }
      
      const quotes = Array.isArray(data) ? data : data.results || [];
      
      return quotes;
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
      if (params.tag) query.append("tag", params.tag);
      if (params.author) query.append("author", params.author);
      if (params.minLength) query.append("minLength", params.minLength.toString());
      if (params.maxLength) query.append("maxLength", params.maxLength.toString());
      query.append("limit", "25"); 

      const url = `${API_BASE_URL}/quotes?${query.toString()}`;
      console.log("Search URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to search quotes: ${response.status}`);
      
      const data = await response.json();
      console.log("Search API response:", data);
      
      // Handle possible response formats
      const quotes = Array.isArray(data) ? data : data.results || [];
      
      return quotes;
    } catch (error) {
      console.error("Error searching quotes:", error);
      return [];
    }
  }

static async getRandomQuote(): Promise<Quote | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/random`);
    if (!response.ok) throw new Error("Failed to fetch random quote");
    const data = await response.json();
    
    if (data.quote) {
      return {
        _id: data.quote.id,
        content: data.quote.content,
        author: data.quote.author.name,
        length: data.quote.content.length,
        tags: data.quote.tags.map((tag: any) => tag.name)
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching random quote:", error);
    return null;
  }
}

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
