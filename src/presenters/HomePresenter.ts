import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logoutUser, setGuest } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../navigation/MainStack";

export function useHomePresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<StackNavigationProp<MainStackParamList, "Home">>();
  const { guest } = useSelector((state: RootState) => state.auth);

  const onLogout = () => dispatch(logoutUser());
  const onAuthButtonPress = guest ? () => dispatch(setGuest(false)) : onLogout;
  const onNavigateToDashboard = () => navigation.navigate("Dashboard");

  return {
    guest,
    onAuthButtonPress,
    onNavigateToDashboard,
  };
}
