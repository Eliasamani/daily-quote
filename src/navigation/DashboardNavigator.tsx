// src/navigation/DashboardNavigator.tsx
import React from "react";
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setGuest } from "../store/slices/authSlice";

import ExploreQuotesScreen from "../screens/ExploreQuotesScreen";
import CreateQuotesScreen from "../screens/CreateQuotesScreen";
import SavedQuotesScreen from "../screens/SavedQuotesScreen";
import MyQuotesScreen from "../screens/MyQuotesScreen";

const Tab = createBottomTabNavigator();

export default function DashboardNavigator() {
  const dispatch = useDispatch();
  const isAuth = useSelector((s: RootState) => Boolean(s.auth.user));

  const requireLogin = () =>
    Alert.alert(
      "Authentication Required",
      "You need to log in to access this.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => dispatch(setGuest(false)),
        },
      ]
    );

  function screenOptions(routeName: string) {
    return {
      tabBarIcon: ({ focused, color, size }: any) => {
        let name: string;
        switch (routeName) {
          case "Explore":
            name = "search";
            break;
          case "Create":
            name = isAuth ? "plus" : "lock";
            break;
          case "Saved":
            name = isAuth ? "bookmark" : "lock";
            break;
          case "My Quotes":
            name = isAuth ? "user" : "lock";
            break;
          default:
            name = "circle";
        }
        return <Icon name={name} size={size} color={color} />;
      },
      tabBarLabel: routeName,
      tabBarActiveTintColor: "#fff",
      tabBarInactiveTintColor: "#777",
      // colored background for active tab:
      tabBarActiveBackgroundColor: "#6200ee",
      tabBarInactiveBackgroundColor: "#fff",
      tabBarStyle: styles.tabBar,
      headerShown: false,
    };
  }

  return (
    <Tab.Navigator initialRouteName="Explore">
      <Tab.Screen
        name="Explore"
        component={ExploreQuotesScreen}
        options={screenOptions("Explore")}
      />

      <Tab.Screen
        name="Create"
        component={CreateQuotesScreen}
        options={screenOptions("Create")}
        listeners={{
          tabPress: (e) => {
            if (!isAuth) {
              e.preventDefault();
              requireLogin();
            }
          },
        }}
      />

      <Tab.Screen
        name="Saved"
        component={SavedQuotesScreen}
        options={screenOptions("Saved")}
        listeners={{
          tabPress: (e) => {
            if (!isAuth) {
              e.preventDefault();
              requireLogin();
            }
          },
        }}
      />

      <Tab.Screen
        name="My Quotes"
        component={MyQuotesScreen}
        options={screenOptions("My Quotes")}
        listeners={{
          tabPress: (e) => {
            if (!isAuth) {
              e.preventDefault();
              requireLogin();
            }
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    borderTopWidth: 0,
    elevation: 5,
  },
});
