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
import { Feather } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Errores
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    let hasError = false;

    setGlobalError("");
    setSuccessMessage("");

    // ----------- Validaciones -----------

    if (!email.trim()) {
      setEmailError("El correo es obligatorio");
      hasError = true;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        setEmailError("El formato del correo no es válido");
        hasError = true;
      } else setEmailError("");
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Debe tener al menos 8 caracteres");
      hasError = true;
    } else setPasswordError("");

    if (!confirmPassword) {
      setConfirmPasswordError("Debes confirmar la contraseña");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      hasError = true;
    } else setConfirmPasswordError("");

    if (hasError) return;

    // ----------- Registrar -----------

    try {
      const res = await registerUser({ email, password });

      setSuccessMessage("Registro exitoso. Redirigiendo...");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setQrCodeUrl(res.data.qrCodeUrl || "");

      setTimeout(() => navigation.replace("Login"), 2500);
    } catch (err) {
      setGlobalError(
        err.response?.data?.message || "Error al registrar usuario"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      {/* Logo */}
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

      {/* Error global */}
      {globalError ? (
        <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
          {globalError}
        </Text>
      ) : null}

      {/* Success msg */}
      {successMessage ? (
        <Text style={{ color: "#ffb100", textAlign: "center", marginBottom: 10 }}>
          {successMessage}
        </Text>
      ) : null}

      {/* Email */}
      <TextInput
        style={globalStyles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
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

      {/* Contraseña */}
      <View
        style={[
          globalStyles.input,
          {
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 12,
          },
        ]}
      >
        <TextInput
          style={{ flex: 1, paddingVertical: 0 }}
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#ffb100"
          />
        </TouchableOpacity>
      </View>

      {passwordError ? (
        <Text style={{ color: "red", fontSize: 13, marginBottom: 10 }}>
          {passwordError}
        </Text>
      ) : null}

      {/* Confirmar contraseña */}
      <View
        style={[
          globalStyles.input,
          {
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 12,
          },
        ]}
      >
        <TextInput
          style={{ flex: 1, paddingVertical: 0 }}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError("");
          }}
          secureTextEntry={!showConfirmPassword}
        />

        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Feather
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={22}
            color="#ffb100"
          />
        </TouchableOpacity>
      </View>

      {confirmPasswordError ? (
        <Text style={{ color: "red", fontSize: 13, marginBottom: 10 }}>
          {confirmPasswordError}
        </Text>
      ) : null}

      {/* Botón */}
      <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* QR */}
      {qrCodeUrl ? (
        <View style={{ alignItems: "center", marginTop: 25 }}>
          <Text style={{ marginBottom: 10 }}>
            Escanea este código en Google Authenticator:
          </Text>
          <Image
            source={{ uri: qrCodeUrl }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        </View>
      ) : null}

      {/* Login link */}
      <Text
        style={globalStyles.linkText}
        onPress={() => navigation.navigate("Login")}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}
