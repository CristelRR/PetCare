import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterPetScreen from "../screens/RegisterPetScreen";
import PetDetailsScreen from "../screens/PetDetailsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          else if (route.name === "RegisterPet")
            iconName = "add-circle-outline";
          else if (route.name === "PetDetails") iconName = "paw-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#42a5f5",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen
        name="RegisterPet"
        component={RegisterPetScreen}
        options={{ title: "Registrar Mascota" }}
      />
      <Tab.Screen
        name="PetDetails"
        component={PetDetailsScreen}
        options={{ title: "Detalles / Historial" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Mi Perfil" }}
      />
    </Tab.Navigator>
  );
}
