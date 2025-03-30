import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./src/config/firebase";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainStack from "./src/navigation/MainStack";
import { store, RootState, AppDispatch } from "./src/store/store";
import { setUser } from "./src/store/slices/authSlice";

const Stack = createStackNavigator();

const RootNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, guest } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      dispatch(setUser(u ? { uid: u.uid, email: u.email } : null));
    });
    return unsubscribe;
  }, [dispatch]);

  // User is considered authenticated if a user exists or if guest mode is active.
  const isAuthenticated = Boolean(user) || guest;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
