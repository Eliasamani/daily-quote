import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
type DashboardStackParamList = {
  SavedQuotes: undefined;
};

export function useSavedQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "SavedQuotes">
    >();

  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.goBack();

  return { onLogout, onLogoPress };
}
