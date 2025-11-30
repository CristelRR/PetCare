import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { verifyResetCode } from "../services/api";
import HeaderLogo from "../components/HeaderLogo";

export default function VerifyResetCode({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!code) {
      setError("Ingresa el código");
      return;
    }

    try {
      await verifyResetCode({ email, code });
      navigation.navigate("ResetPassword", { email });
    } catch {
      setError("Código incorrecto o expirado");
    }
  };

  return (
    <View style={globalStyles.container}>
            <HeaderLogo />

      <Text style={globalStyles.title}>Verificar Código</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Código enviado al correo"
        keyboardType="numeric"
        value={code}
        onChangeText={(t) => { setCode(t); setError(""); }}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <TouchableOpacity style={globalStyles.button} onPress={handleVerify}>
        <Text style={globalStyles.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
}
