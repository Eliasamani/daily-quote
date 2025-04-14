import { Tag } from "../store/slices/quote"; 

const API_BASE_URL = "https://api.quotable.kurokeita.dev/api";

const isProduction = (): boolean => {
  return typeof window !== 'undefined' && 
         window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1';
};

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
      
      const quotes = Array.isArray(data) ? data : data.results || [];
      
      return quotes;
    } catch (error) {
      console.error("Error searching quotes:", error);
      return [];
    }
  }

  static async getRandomQuote(): Promise<Quote | null> {
    try {
      const cacheBuster = new Date().getTime();
      
      let url = `${API_BASE_URL}/quotes/random?t=${cacheBuster}`;
      
      if (isProduction()) {
        url = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&timestamp=${cacheBuster}`;
        console.log("Using CORS proxy for production environment:", url);
      }
      
      console.log("Fetching random quote from:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch random quote: ${response.status}`);
      }
      
      let data;
      if (isProduction()) {
        const proxyResponse = await response.json();
        data = JSON.parse(proxyResponse.contents);
      } else {
        data = await response.json();
      }
      
      console.log("Random quote API response:", data);
      
      if (data) {
        if (data.quote) {
          return {
            _id: data.quote.id || data.quote._id || `quote-${Date.now()}`,
            content: data.quote.content,
            author: data.quote.author?.name || data.quote.author || "Unknown",
            length: data.quote.content.length,
            tags: data.quote.tags?.map((tag: any) => tag.name || tag) || []
          };
        } else if (data.content) {
          return {
            _id: data._id || data.id || `quote-${Date.now()}`,
            content: data.content,
            author: data.author?.name || data.author || "Unknown",
            length: data.content.length,
            tags: data.tags?.map((tag: any) => tag.name || tag) || []
          };
        } else if (Array.isArray(data) && data.length > 0) {
          const quote = data[0];
          return {
            _id: quote._id || quote.id || `quote-${Date.now()}`,
            content: quote.content,
            author: quote.author?.name || quote.author || "Unknown",
            length: quote.content.length,
            tags: quote.tags?.map((tag: any) => tag.name || tag) || []
          };
        }
      }
      
      console.error("Unexpected API response format:", data);
      return null;
    } catch (error) {
      console.error("Error fetching random quote:", error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error("This might be a CORS issue. Current origin:", 
                     typeof window !== 'undefined' ? window.location.origin : 'unknown');
      }
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