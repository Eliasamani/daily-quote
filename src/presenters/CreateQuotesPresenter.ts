import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
type DashboardStackParamList = {
  CreateQuotes: undefined;
};

export function useCreateQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "CreateQuotes">
    >();

  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.goBack();

  return { onLogout, onLogoPress };
}
