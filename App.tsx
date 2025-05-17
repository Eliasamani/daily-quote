import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { auth } from "./src/config/firebase";
import { store, RootState, AppDispatch } from "./src/store/store";
import { setUser } from "./src/store/slices/authSlice";
import { fetchSavedQuotes } from "./src/store/slices/savedQuotesSlice";
import { fetchCreatedQuotes } from "./src/store/slices/createdQuotesSlice";

import AuthNavigator from "./src/navigation/AuthNavigator";
import MainStack from "./src/navigation/MainStack";
import CreateQuotesScreen from "./src/screens/CreateQuotesScreen";

const Stack = createStackNavigator();

function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, guest } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      dispatch(setUser(u ? { uid: u.uid, email: u.email } : null));
      if (u) {
        // Hämta ut användarens sparade och skapade citat när de loggar in
        dispatch(fetchSavedQuotes(u.uid));
        dispatch(fetchCreatedQuotes(u.uid));
      }
    });
    return () => unsub();
  }, [dispatch]);

  const isAuthenticated = Boolean(user) || guest;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        <Stack.Screen name="CreateQuotes" component={CreateQuotesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
