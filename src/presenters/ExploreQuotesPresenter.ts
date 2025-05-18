import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logoutUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  fetchQuotes,
  fetchTags,
  searchQuotes,
  getRandomQuote,
  type SearchParams,
  type Quote,
} from "../store/slices/exploreQuotesSlice";

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
  

  const quotes = useAppSelector((state) => state.exploreQuotes?.quotes || []);
  const tags = useAppSelector((state) => state.exploreQuotes?.tags || []);
  const isLoading = useAppSelector((state) => state.exploreQuotes?.loading || false);

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [searchByAuthor, setSearchByAuthor] = useState(false);

  const toggleSearchByAuthor = (value: boolean) => {
    if (searchByAuthor && !value) {
      setSearch("");
    }
    setSearchByAuthor(value);
  };


  const onLogout = () => dispatch(logoutUser());
  const onAuthButtonPress = guest ? () => dispatch(setGuest(false)) : onLogout;
  const onLogoPress = () => navigation.goBack();

  useEffect(() => {

    dispatch(fetchTags());
    dispatch(fetchQuotes());
  }, [dispatch]);

  const onSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };
  
  function onSearchPress() {
    const params: SearchParams = {
      query: searchByAuthor ? undefined : search,
      author: searchByAuthor ? search : undefined,
      tag: genre,
      minLength: minLength ? parseInt(minLength, 10) : undefined,
      maxLength: maxLength ? parseInt(maxLength, 10) : undefined,
    };
    
    dispatch(searchQuotes(params));
  }

  function onRandomQuotePress() {
    dispatch(getRandomQuote({ tag: genre }));
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