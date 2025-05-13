import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require("./assets/Logo1.png")} style={styles.logo} />
      <View style={{ height: 22 }} />

      <Text style={styles.title}>Welcome back Buzzmates!</Text>
      <View style={{ height: 44 }} />

      <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <View style={{ height: 22 }} />

      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <View style={{ height: 22 }} />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>
      <View style={{ height: 22 }} />

      <TouchableOpacity style={styles.googleButton}>
        <Image source={require("./assets/Google.png")} style={styles.googleIcon} />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontFamily: "MonSemi",
    color: "#000",
  },
  signInButton: {
    width: "90%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#FAF3E0",
    alignItems: "center",
    justifyContent: "center", 
    borderWidth: 1,
    borderColor: "#000",
  },
  signUpButton: {
    width: "90%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#FE851C",
    alignItems: "center",
    justifyContent: "center", 
    borderWidth: 1,
    borderColor: "#000",
  },  
  buttonText: {
    fontSize: 18,
    fontFamily: "MonBold",
    color: "#000",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#999",
  },
  orText: {
    marginHorizontal: 10,
    fontFamily: "MonRegular",
    fontSize: 14,
    color: "#666",
  },
  googleButton: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 30,
    width: "90%",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#000",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontFamily: "MonSemi",
    color: "#000",
  },
});

export default Welcome;