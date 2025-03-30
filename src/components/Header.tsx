import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

interface HeaderProps {
  title: string;
  onLogoPress?: () => void;
  authButtonText?: string;
  onAuthButtonPress?: () => void;
}

export default function Header({
  title,
  onLogoPress,
  authButtonText,
  onAuthButtonPress,
}: HeaderProps) {
  const buttonStyle = [
    styles.authButton,
    authButtonText === "Logout" && styles.logoutButton,
  ];

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onLogoPress} style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {authButtonText && onAuthButtonPress && (
        <TouchableOpacity style={buttonStyle} onPress={onAuthButtonPress}>
          <Text style={styles.authButtonText}>{authButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 60,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 40,
  },
  logoContainer: {},
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  authButton: {
    backgroundColor: "#007aff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  logoutButton: {
    backgroundColor: "red",
  },
  authButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
