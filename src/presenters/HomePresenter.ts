import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logoutUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { MainStackParamList } from "../navigation/MainStack";

export function useHomePresenter() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<MainStackParamList, "Home">>();
  const guest = useAppSelector((state) => state.auth.guest);

  const onLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const onAuthButtonPress = useCallback(() => {
    if (guest) {
      dispatch(setGuest(false));
    } else {
      onLogout();
    }
  }, [dispatch, guest, onLogout]);

  const onNavigateToDashboard = useCallback(() => {
    navigation.navigate("Dashboard");
  }, [navigation]);

  return {
    guest,
    onAuthButtonPress,
    onNavigateToDashboard,
  };
}
