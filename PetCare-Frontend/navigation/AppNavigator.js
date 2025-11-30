import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TabNavigator from "./TabNavigator";

// 👇 importa las nuevas pantallas
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyResetCodeScreen from "../screens/VerifyResetCodeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

import CreatePostScreen from "../screens/CreatePostScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />

        <Stack.Screen name="CreatePost" component={CreatePostScreen} />

        {/* 🔹 Nuevas pantallas de recuperación */}
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
