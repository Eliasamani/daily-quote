import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import { useLoginPresenter } from "../presenters/LoginPresenter";

export default function LoginScreen() {
  const {
    email,
    password,
    error,
    loading,
    onEmailChange,
    onPasswordChange,
    onLogin,
    onExploreAsGuest,
    onNavigateToRegister,
  } = useLoginPresenter();

  return (
    <View style={styles.container}>
      <Header
        title="Login"
        authButtonText="Register"
        onAuthButtonPress={onNavigateToRegister}
      />
      <View style={styles.content}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={onEmailChange}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={onPasswordChange}
          style={styles.input}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={onLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.exploreButton]}
          onPress={onExploreAsGuest}
        >
          <Text style={styles.buttonText}>Explore as Guest</Text>
        </TouchableOpacity>
        <Text style={styles.link} onPress={onNavigateToRegister}>
          Don't have an account? Register
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
    width: "100%",
  },
  error: { color: "red", marginBottom: 8, textAlign: "center" },
  button: {
    width: "100%",
    maxWidth: 200,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: { backgroundColor: "#007aff" },
  exploreButton: { backgroundColor: "#4caf50" },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  link: { marginTop: 12, color: "#0066cc", textAlign: "center" },
});
