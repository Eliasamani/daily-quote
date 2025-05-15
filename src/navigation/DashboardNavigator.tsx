import React, { useState } from "react";
import { Alert, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import AuthRequiredModal from "../components/AuthRequiredModal";

import ExploreQuotesScreen from "../screens/ExploreQuotesScreen";
import CreateQuotesScreen from "../screens/CreateQuotesScreen";
import SavedQuotesScreen from "../screens/SavedQuotesScreen";
import MyQuotesScreen from "../screens/MyQuotesScreen";

const Tab = createBottomTabNavigator();

export default function DashboardNavigator() {
  const dispatch = useDispatch();
  const isAuth = useSelector((s: RootState) => Boolean(s.auth.user));
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const requireLogin = () => {
    if (Platform.OS === "web") {
      setLoginModalVisible(true);
    } else {
      Alert.alert(
        "Authentication required",
        "You need to log in to use this feature",
        [{ text: "OK" }]
      );
    }
  };

  const screenOptions = (routeName: string) => ({
    tabBarIcon: ({ color, size }: any) => {
      let name: "search" | "plus" | "bookmark" | "user" | "lock" = "search";
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
      }
      return <FontAwesome name={name} size={size} color={color} />;
    },
    tabBarLabel: routeName,
    tabBarActiveTintColor: "#fff",
    tabBarInactiveTintColor: "#777",
    tabBarActiveBackgroundColor: "#6200ee",
    tabBarInactiveBackgroundColor: "#fff",
    tabBarStyle: styles.tabBar,
    headerShown: false,
  });

  return (
    <>
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

      <AuthRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </>
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
