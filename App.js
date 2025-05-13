import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./SplashScreen";
import Welcome from "./Welcome";
import Login from "./Login";
import Signup from "./Signup";  
import Home from "./Home";
import Expenses from "./Expenses";
import DailyExpenses from "./DailyExpenses";
import Savings from "./Savings";
import Reminder from "./Reminder";
import ExpenseDetailsScreen from "./ExpenseDetailsScreen";

import ReceiptScanner from "./ReceiptScanner";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "MonRegular": require("./assets/fonts/MonRegular.ttf"),
          "MonSemi": require("./assets/fonts/MonSemi.ttf"),
          "MonBold": require("./assets/fonts/MonBold.ttf"),
          "MonMedium": require("./assets/fonts/MonMedium.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Font loading error:", error);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FAA053" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Expenses" component={Expenses} />
        <Stack.Screen name="DailyExpenses" component={DailyExpenses} />
        <Stack.Screen name="Savings" component={Savings} />
        <Stack.Screen name="Reminder" component={Reminder} />
        <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />
        <Stack.Screen name="ReceiptScanner" component={ReceiptScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}