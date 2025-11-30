import React from "react";
import { Image, View } from "react-native";
import logo from "../assets/logo1.png";

export default function HeaderLogo() {
  return (
    <View style={{ alignItems: "center", marginBottom: 25 }}>
      <Image
        source={logo}
        style={{
          width: 120,
          height: 120,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
