import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExploreQuotesScreen from "../screens/ExploreQuotesScreen";
import CreateQuotesScreen from "../screens/CreateQuotesScreen";
import SavedQuotesScreen from "../screens/SavedQuotesScreen";
import MyQuotesScreen from "../screens/MyQuotesScreen";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setGuest } from "../store/slices/authSlice";

const Tab = createBottomTabNavigator();

// A custom tab bar button that disables touch when needed
const CustomTabBarButton = (props: any & { disabled: boolean }) => {
  const { disabled, onPress, children } = props;
  const dispatch = useDispatch();

  if (disabled) {
    return (
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "Authentication Required",
            "You need to log in to access this feature. Would you like to go to the login screen?",
            [
              { text: "No", style: "cancel" }, // User stays on current screen
              { text: "Yes", onPress: () => dispatch(setGuest(false)) }, // Dispatches action to switch to auth flow
            ]
          )
        }
        style={{ opacity: 0.5 }}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

export default function DashboardNavigator() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = Boolean(user);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ExploreQuotes"
        component={ExploreQuotesScreen}
        options={{ title: "Explore Quotes" }}
      />
      <Tab.Screen
        name="CreateQuotes"
        component={CreateQuotesScreen}
        options={{
          title: "Create Quotes",
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} disabled={!isAuthenticated} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedQuotes"
        component={SavedQuotesScreen}
        options={{
          title: "Saved Quotes",
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} disabled={!isAuthenticated} />
          ),
        }}
      />
      <Tab.Screen
        name="MyQuotes"
        component={MyQuotesScreen}
        options={{
          title: "My Quotes",
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} disabled={!isAuthenticated} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
