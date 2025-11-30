import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { resetPassword } from "../services/api";
import HeaderLogo from "../components/HeaderLogo";

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!password || !confirm) {
      setError("Llena ambos campos");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await resetPassword({ email, password });
      alert("Contraseña actualizada");
      navigation.replace("Login");
    } catch {
      setError("Error al actualizar contraseña");
    }
  };

  return (
    <View style={globalStyles.container}>
            <HeaderLogo />

      <Text style={globalStyles.title}>Nueva Contraseña</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={password}
        onChangeText={(t) => setPassword(t)}
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirm}
        onChangeText={(t) => setConfirm(t)}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
        <Text style={globalStyles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}
