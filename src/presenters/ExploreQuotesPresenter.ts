import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logoutUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ExploreQuotesModel, Quote } from '../models/ExploreQuotesModel';
import { Tag } from '../store/slices/quote';

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
  
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const onLogout = () => dispatch(logoutUser());
  const onAuthButtonPress = guest ? () => dispatch(setGuest(false)) : onLogout;
  const onLogoPress = () => navigation.goBack();

  useEffect(() => {
    fetchInitialQuotes();
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const allTags = await ExploreQuotesModel.getTags();
      setTags(allTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };
  
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
    
    setSearch('');
    setGenre('');
    setMinLength('');
    setMaxLength('');
    
    try {
      let attempts = 0;
      let randomQuote = null;
      
      while (attempts < 3 && randomQuote === null) {
        attempts++;
        try {
          console.log(`Attempting to fetch random quote (attempt ${attempts})`);
          randomQuote = await ExploreQuotesModel.getRandomQuote();
          
          if (randomQuote === null && attempts < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (err) {
          console.error(`Attempt ${attempts} failed:`, err);
          if (attempts < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (randomQuote) {
        console.log("Successfully fetched random quote:", randomQuote);
        setQuotes([randomQuote]);
      } else {
        console.error("Failed to fetch random quote after multiple attempts");
        setQuotes([]);
        
      }
    } catch (error) {
      console.error("Error in random quote handler:", error);
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return {
    guest,
    onAuthButtonPress,
    onLogoPress,
    
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
    tags,
    onSearchPress,
    onRandomQuotePress,
  };
}