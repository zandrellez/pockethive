import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Welcome"); 
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("./assets/Logo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200, 
    height: 200,
    resizeMode: "contain",
  },
});

export default SplashScreen;