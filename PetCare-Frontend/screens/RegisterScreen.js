// src/screens/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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

  // Errores / mensajes
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    let hasError = false;
    setGlobalError("");
    setSuccessMessage("");

    // -------- VALIDACIONES --------
    if (!email.trim()) {
      setEmailError("El correo es obligatorio");
      hasError = true;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        setEmailError("Correo inválido");
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
      setConfirmPasswordError("Confirma tu contraseña");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      hasError = true;
    } else setConfirmPasswordError("");

    if (hasError) return;

    // --- REGISTRO ---
    try {
      const res = await registerUser({ email, password });
      setSuccessMessage("¡Registro exitoso! Redirigiendo...");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.form}>
        {/* Logo */}
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Crear Cuenta</Text>

        {/* MENSAJES */}
        {globalError ? <Text style={styles.error}>{globalError}</Text> : null}
        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : null}

        {/* INPUT EMAIL */}
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setEmailError("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        {/* PASSWORD */}
        <View style={[styles.input, styles.inputRow]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Contraseña"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={22} color="#ffb100" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

        {/* CONFIRM PASSWORD */}
        <View style={[styles.input, styles.inputRow]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError("");
            }}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#ffb100" />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? (
          <Text style={styles.error}>{confirmPasswordError}</Text>
        ) : null}

        {/* BOTÓN */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        {/* QR */}
        {qrCodeUrl ? (
          <View style={styles.qrContainer}>
            <Text style={styles.qrText}>Escanea este QR en Google Authenticator:</Text>
            <Image source={{ uri: qrCodeUrl }} style={styles.qrImage} />
          </View>
        ) : null}

        {/* LINK */}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          ¿Ya tienes cuenta? <Text style={styles.linkUnderline}>Inicia sesión</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* 🎨 ESTILOS BONITOS */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  form: {
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 13,
    alignSelf: "flex-start",
  },
  success: {
    color: "#ffb100",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ffb100",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrText: {
    marginBottom: 8,
    textAlign: "center",
    color: "#555",
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  link: {
    marginTop: 20,
    fontSize: 15,
    color: "#333",
  },
  linkUnderline: {
    textDecorationLine: "underline",
    color: "#ffb100",
  },
});
