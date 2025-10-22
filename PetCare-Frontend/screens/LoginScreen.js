import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { loginUser, verifyOtp } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/logo1.png";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleLogin = async () => {
    let hasError = false;

    if (!email) {
      setEmailError("Correo obligatorio");
      hasError = true;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        setEmailError("Correo inválido");
        hasError = true;
      } else {
        setEmailError("");
      }
    }

    if (!password) {
      setPasswordError("Contraseña obligatoria");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Contraseña demasiado corta");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      console.log("Intentando login con:", email, password);
      const res = await loginUser({ email, password });
console.log("Respuesta del backend:", res.data); 
setOtpSent(true);

    } catch (err) {
      alert(err.response?.data?.message || "Error de conexión");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Ingresa el código OTP");
      return;
    } else {
      setOtpError("");
    }

    try {
      const res = await verifyOtp({ email, otp });
      await AsyncStorage.setItem("token", res.data.token);
      navigation.replace(res.data.firstLogin ? "Profile" : "Main");
    } catch {
      setOtpError("Código incorrecto o expirado");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Image 
        source={logo} 
        style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 20 }} 
        resizeMode="contain"
      />

      <Text style={globalStyles.title}>Iniciar Sesión</Text>

      {!otpSent ? (
        <>
          <TextInput
            style={globalStyles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={(text) => { setEmail(text); setEmailError(""); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={{ color: "red", marginBottom: 5 }}>{emailError}</Text> : null}

          <View style={{ position: "relative", width: "100%" }}>
            <TextInput
              style={globalStyles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => { setPassword(text); setPasswordError(""); }}
              secureTextEntry={!showPassword}
            />
            <Text
              style={{ position: "absolute", right: 10, top: 15, color: "blue", fontWeight: "bold" }}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </Text>
          </View>
          {passwordError ? <Text style={{ color: "red", marginBottom: 5 }}>{passwordError}</Text> : null}

          <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
            <Text style={globalStyles.buttonText}>Enviar código</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={globalStyles.input}
            placeholder="Código OTP"
            value={otp}
            onChangeText={(text) => { setOtp(text); setOtpError(""); }}
            keyboardType="numeric"
          />
          {otpError ? <Text style={{ color: "red", marginBottom: 5 }}>{otpError}</Text> : null}

          <TouchableOpacity style={globalStyles.button} onPress={handleVerifyOtp}>
            <Text style={globalStyles.buttonText}>Verificar código</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={globalStyles.linkText} onPress={() => navigation.navigate("Registro")}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}
