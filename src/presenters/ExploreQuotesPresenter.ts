// src/presenters/ExploreQuotesPresenter.ts
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logoutUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ExploreQuotesModel, Quote } from "../models/ExploreQuotesModel";
import { Tag } from "../store/slices/quoteMetaSlice";

type DashboardStackParamList = {
  ExploreQuotes: undefined;
};

export function useExploreQuotesPresenter() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "ExploreQuotes">
    >();
  const { guest, user } = useAppSelector((state) => state.auth);
  const uid = user?.uid ?? "";

  // Quote search state
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchByAuthor, setSearchByAuthor] = useState(false);

  const toggleSearchByAuthor = (value: boolean) => {
    if (searchByAuthor && !value) {
      setSearch("");
    }
    setSearchByAuthor(value);
  };

  // Authentication handlers
  const onLogout = () => dispatch(logoutUser());
  const onAuthButtonPress = guest ? () => dispatch(setGuest(false)) : onLogout;
  const onLogoPress = () => navigation.goBack();

  useEffect(() => {
    fetchTags();
    fetchInitialQuotes();
  }, []);

  const onSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  async function fetchTags() {
    try {
      const allTags = await ExploreQuotesModel.getTags();
      setTags(allTags);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }

  async function fetchInitialQuotes() {
    setIsLoading(true);
    try {
      const result = await ExploreQuotesModel.getQuotes();
      setQuotes(result);
    } catch (err) {
      console.error("Error fetching initial quotes:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSearchPress() {
    setIsLoading(true);
    try {
      const params = {
        query: searchByAuthor ? undefined : search,
        author: searchByAuthor ? search : undefined,
        tag: genre,
        minLength: minLength ? parseInt(minLength, 10) : undefined,
        maxLength: maxLength ? parseInt(maxLength, 10) : undefined,
      };
      const result = await ExploreQuotesModel.searchQuotes(params);
      setQuotes(result);
    } catch (err) {
      console.error("Error searching quotes:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function onRandomQuotePress() {
    setIsLoading(true);
    try {
      const rand = await ExploreQuotesModel.getRandomQuote({ tag: genre });
      setQuotes(rand ? [rand] : []);
    } catch (err) {
      console.error("Error fetching random quote:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    guest,
    uid,
    onAuthButtonPress,
    onLogoPress,
    search,
    setSearch,
    genre,
    setGenre,
    tags,
    quotes,
    isLoading,
    searchByAuthor,
    toggleSearchByAuthor,
    onSearchPress,
    onRandomQuotePress,
    selectedQuote,
    onSelectQuote,
  };
}
