import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logoutUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ExploreQuotesModel, Quote } from '../models/ExploreQuotesModel.ts';

type DashboardStackParamList = {
  ExploreQuotes: undefined;
};

export function useExploreQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "ExploreQuotes">
    >();
  const { guest } = useSelector((state: RootState) => state.auth);
  
  // Quote search state
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication handlers (keep your existing code)
  const onLogout = () => dispatch(logoutUser());
  const onAuthButtonPress = guest ? () => dispatch(setGuest(false)) : onLogout;
  const onLogoPress = () => navigation.goBack();

  // Initialize and fetch some data when component mounts
  useEffect(() => {
    fetchInitialQuotes();
  }, []);

  const fetchInitialQuotes = async () => {
    setIsLoading(true);
    try {
      const fetchedQuotes = await ExploreQuotesModel.getQuotes();
      setQuotes(fetchedQuotes);
    } catch (error) {
      console.error("Error fetching initial quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchPress = async () => {
    setIsLoading(true);
    try {
      const searchParams = {
        query: search,
        genre: genre,
        minLength: minLength ? parseInt(minLength) : undefined,
        maxLength: maxLength ? parseInt(maxLength) : undefined,
      };
      
      const searchResults = await ExploreQuotesModel.searchQuotes(searchParams);
      setQuotes(searchResults);
    } catch (error) {
      console.error("Error searching quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRandomQuotePress = async () => {
    setIsLoading(true);
    try {
      const randomQuote = await ExploreQuotesModel.getRandomQuote();
      setQuotes(randomQuote ? [randomQuote] : []);
    } catch (error) {
      console.error("Error fetching random quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Auth state and handlers (from your existing code)
    guest,
    onAuthButtonPress,
    onLogoPress,
    
    // Quote search state and handlers (new)
    search,
    setSearch,
    genre,
    setGenre,
    minLength,
    setMinLength,
    maxLength,
    setMaxLength,
    quotes,
    isLoading,
    onSearchPress,
    onRandomQuotePress,
  };
}