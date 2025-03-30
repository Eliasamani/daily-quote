import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { registerUser } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";

export function useRegisterPresenter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const navigation =
    useNavigation<StackNavigationProp<AuthStackParamList, "Register">>();

  const onEmailChange = (text: string) => setEmail(text);
  const onPasswordChange = (text: string) => setPassword(text);

  const onRegister = () => {
    dispatch(registerUser({ email, password }));
  };

  const onNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  return {
    email,
    password,
    error,
    loading,
    onEmailChange,
    onPasswordChange,
    onRegister,
    onNavigateToLogin,
  };
}
