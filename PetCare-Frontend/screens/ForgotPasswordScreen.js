import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { requestPasswordReset } from "../services/api";
import HeaderLogo from "../components/HeaderLogo";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    if (!email) {
      setError("Ingresa tu correo");
      return;
    }

    try {
      await requestPasswordReset({ email });
      setSuccess("Se envió un código de recuperación a tu correo.");
      setTimeout(() => {
        navigation.navigate("VerifyResetCode", { email });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar código");
    }
  };

  return (
    <View style={globalStyles.container}>
            <HeaderLogo />

      <Text style={globalStyles.title}>Recuperar Contraseña</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Ingresa tu correo"
        value={email}
        onChangeText={(t) => { setEmail(t); setError(""); }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      {success ? <Text style={{ color: "green" }}>{success}</Text> : null}

      <TouchableOpacity style={globalStyles.button} onPress={handleSend}>
        <Text style={globalStyles.buttonText}>Enviar código</Text>
      </TouchableOpacity>
    </View>
  );
}
