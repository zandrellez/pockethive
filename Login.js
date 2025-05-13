import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert 
} from "react-native";
import Icon from "react-native-vector-icons/Feather"; // Feather Icons for Eye
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    if (email === "f" && password === "f") {
      navigation.navigate("Home");
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Dashed line */}
        <Image source={require("./assets/Dash.png")} style={styles.dashImage} />
        {/* Bee image at end of dashed line */}
        <Image source={require("./assets/bee.png")} style={styles.beeImage} />
        <Text style={styles.welcomeText}>Welcome back Buzzmate!</Text>
      </View>

      {/* Form Container */}
      <View style={styles.card}>
        <Text style={styles.signInHeader}>SIGN IN</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter Email Address" 
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Enter Password"
              placeholderTextColor="#666"
              secureTextEntry={!passwordVisible} 
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeButton}
            >
              <Icon 
                name={passwordVisible ? "eye-off" : "eye"} 
                size={20} 
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Sign Up Text */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: 200,
    backgroundColor: "rgba(254, 133, 28, 0.3)", 
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dashImage: {
    position: "absolute",
    top: 20,
    right: 10, 
    width: 340,
    height: 165,
    resizeMode: "contain",
    zIndex: 1, 
  },
  beeImage: {
    position: "absolute",
    top: 150,
    left: 20, 
    width: 50,
    height: 50,
    resizeMode: "contain",
    zIndex: 2, 
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: "MonSemi",
    color: "#000",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, 
    marginTop: -30, 
  },
  signInHeader: {
    fontSize: 30,
    fontFamily: "MonMedium",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    position: "relative",
  },
  label: {
    position: "absolute",
    top: -10, 
    left: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 5,
    fontSize: 14,
    fontFamily: "MonSemi",
    color: "#333",
    zIndex: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25, 
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 20,
    fontSize: 15,
    fontFamily: "MonRegular",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "MonRegular",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
  },
  signInButton: {
    width: "100%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#FAA053",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "MonBold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
  },
  signupText: {
    fontSize: 14,
    fontFamily: "MonRegular",
    color: "#000",
    textAlign: "center", 
  },
  signupLink: {
    color: "#6176FF",
    fontSize: 14,
    fontFamily: "MonBold",
  },
});

export default Login;