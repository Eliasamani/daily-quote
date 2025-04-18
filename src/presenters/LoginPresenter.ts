import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { loginUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";

export function useLoginPresenter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigation =
    useNavigation<StackNavigationProp<AuthStackParamList, "Login">>();

  const onEmailChange = (text: string) => setEmail(text);
  const onPasswordChange = (text: string) => setPassword(text);

  const onLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  const onExploreAsGuest = () => {
    dispatch(setGuest(true));
  };

  const onNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return {
    email,
    password,
    error,
    loading,
    onEmailChange,
    onPasswordChange,
    onLogin,
    onExploreAsGuest,
    onNavigateToRegister,
  };
}
