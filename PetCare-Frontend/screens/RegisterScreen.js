import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { registerUser } from "../services/api";
import logo from "../assets/logo1.png";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Errores y mensajes
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    let hasError = false;
    setGlobalError("");
    setSuccessMessage("");

    // 🔹 Validaciones frontend
    if (!email) {
      setEmailError("El correo es obligatorio");
      hasError = true;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        setEmailError("El formato del correo no es válido");
        hasError = true;
      } else {
        setEmailError("");
      }
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Debe tener al menos 8 caracteres");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      const res = await registerUser({ email, password });

      // 🔸 Si todo va bien
      setSuccessMessage("Registro exitoso. Redirigiendo al inicio de sesión :) ...");
      setEmail("");
      setPassword("");
      setQrCodeUrl(res.data.qrCodeUrl || "");

      // 🔸 Redirigir automáticamente después de 2.5 segundos
      setTimeout(() => {
        navigation.replace("Login");
      }, 2500);
    } catch (err) {
      setGlobalError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      {/* 🔸 Logo */}
      <Image
        source={logo}
        style={{
          width: 120,
          height: 120,
          alignSelf: "center",
          marginBottom: 20,
        }}
        resizeMode="contain"
      />

      <Text style={globalStyles.title}>Registro</Text>

      {/* 🔸 Mensaje global de error */}
      {globalError ? (
        <Text
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: 10,
            fontWeight: "500",
          }}
        >
          {globalError}
        </Text>
      ) : null}

      {/* 🔸 Mensaje de éxito */}
      {successMessage ? (
        <Text
          style={{
            color: "#ffb100",
            textAlign: "center",
            marginBottom: 10,
            fontWeight: "600",
          }}
        >
          {successMessage}
        </Text>
      ) : null}

      {/* 🔸 Campo Email */}
      <TextInput
        style={globalStyles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? (
        <Text style={{ color: "red", fontSize: 13, marginBottom: 10 }}>
          {emailError}
        </Text>
      ) : null}

      {/* 🔸 Campo Contraseña */}
      <View style={{ position: "relative", width: "100%" }}>
        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          secureTextEntry={!showPassword}
        />
        <Text
          style={{
            position: "absolute",
            right: 15,
            top: 15,
            color: "#ffb100",
            fontWeight: "600",
          }}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </Text>
      </View>
      {passwordError ? (
        <Text style={{ color: "red", fontSize: 13, marginBottom: 10 }}>
          {passwordError}
        </Text>
      ) : null}

      {/* 🔸 Botón */}
      <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* 🔸 QR generado (opcional) */}
      {qrCodeUrl ? (
        <View style={{ alignItems: "center", marginTop: 25 }}>
          <Text style={{ marginBottom: 10, color: "#333", fontWeight: "500" }}>
            Escanea este código QR en Google Authenticator:
          </Text>
          <Image
            source={{ uri: qrCodeUrl }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        </View>
      ) : null}

      {/* 🔸 Enlace a login */}
      <Text
        style={globalStyles.linkText}
        onPress={() => navigation.navigate("Login")}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}
