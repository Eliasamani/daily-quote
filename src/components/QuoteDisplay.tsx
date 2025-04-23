import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Quote } from "../models/ExploreQuotesModel";

type QuoteDisplayProps = {
  quote?: Quote | null;
  isLoading?: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote: propQuote, isLoading: propIsLoading }) => {
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propIsLoading !== undefined || propQuote) {
      return;
    }
    
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.quotable.kurokeita.dev/api/quotes/random");
        if (!res.ok) throw new Error("Failed to fetch quote");
        const data = await res.json();
        
        // Handle author property safely
        const authorValue = typeof data.author === 'object' ? 
          (data.author?.name || "Unknown") : 
          (data.author || "Unknown");
          
        setRandomQuote({
          _id: data._id || String(Math.random()),
          content: data.content,
          author: authorValue
        });
      } catch (err) {
        console.error("Error in QuoteDisplay:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [propQuote, propIsLoading]);

  console.log("QuoteDisplay props:", { propQuote, propIsLoading });
  console.log("QuoteDisplay state:", { randomQuote, loading, error });

  if (propIsLoading || (propQuote === undefined && loading)) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  
  if (!propQuote && error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }
  
  const displayQuote = propQuote || randomQuote;
  
  if (!displayQuote) {
    console.log("No quote to display");
    return <Text style={styles.error}>No quote available</Text>;
  }

  return (
    <View style={styles.quoteContainer}>
      <Text style={styles.content}>"{displayQuote.content}"</Text>
      <Text style={styles.meta}>— {displayQuote.author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  content: {
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: "#555",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: 10,
  }
});

export default QuoteDisplay;