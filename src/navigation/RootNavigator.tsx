import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import MainStack from "./MainStack";
import { RootState } from "../store/store";

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, guest } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {user || guest ? <MainStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
