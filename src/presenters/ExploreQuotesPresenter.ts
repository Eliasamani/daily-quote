// src/presenters/ExploreQuotesPresenter.ts

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logoutUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ExploreQuotesModel, Quote } from "../models/ExploreQuotesModel";
import { Tag } from "../store/slices/quote";

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

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const onLogout = () => dispatch(logoutUser());
  const onAuthButtonPress = guest ? () => dispatch(setGuest(false)) : onLogout;
  const onLogoPress = () => navigation.goBack();

  useEffect(() => {
    fetchTags();
    fetchInitialQuotes();
  }, []);

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
      setQuotes(result); // <- now the array of Quote
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
        query: search,
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
      const rand = await ExploreQuotesModel.getRandomQuote();
      setQuotes(rand ? [rand] : []);
    } catch (err) {
      console.error("Error fetching random quote:", err);
    } finally {
      setIsLoading(false);
    }
  }

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
    tags,
    quotes,
    isLoading,
    onSearchPress,
    onRandomQuotePress,
  };
}
