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

  const [loading, setLoading] = useState(false); // 👈 evita doble llamada
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  /* ================== LOGIN ================== */
  const handleLogin = async () => {
    if (loading) return; // 👈 evita doble tap
    setLoading(true);

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

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      console.log(">>> Enviando login...");
      const res = await loginUser({ email, password });

      console.log("Respuesta backend:", res.data);
      setOtpSent(true);

    } catch (err) {
      alert(err.response?.data?.message || "Error de conexión");
    }

    setLoading(false);
  };

  /* ================== VERIFY OTP ================== */
  const handleVerifyOtp = async () => {
  if (verifyingOtp) return;
  setVerifyingOtp(true);

  if (!otp) {
    setOtpError("Ingresa el código OTP");
    setVerifyingOtp(false);
    return;
  } else {
    setOtpError("");
  }

  try {
    const res = await verifyOtp({ email, otp });
    console.log("✅ OTP OK, respuesta backend:", res.data);

    await AsyncStorage.setItem("token", res.data.token);

    const firstLogin = res.data.user.firstLogin;

    if (firstLogin) navigation.replace("Profile");
    else navigation.replace("Main");
  } catch (err) {
    console.log("❌ Error verifyOtp:", err.response?.data || err.message);
    setOtpError("Código incorrecto o expirado");
  }

  setVerifyingOtp(false);
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
          {/* ======= EMAIL ======= */}
          <TextInput
            style={globalStyles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={(text) => { setEmail(text); setEmailError(""); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={{ color: "red", marginBottom: 5 }}>{emailError}</Text> : null}

          {/* ======= PASSWORD ======= */}
          <View style={{ position: "relative", width: "100%" }}>
            <TextInput
              style={globalStyles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => { setPassword(text); setPasswordError(""); }}
              secureTextEntry={!showPassword}
            />
            <Text
              style={{
                position: "absolute",
                right: 10,
                top: 15,
                color: "blue",
                fontWeight: "bold"
              }}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </Text>
          </View>
          {passwordError ? <Text style={{ color: "red", marginBottom: 5 }}>{passwordError}</Text> : null}

          {/* ======= LOGIN BUTTON ======= */}
          <TouchableOpacity
            style={[
              globalStyles.button,
              loading ? { opacity: 0.6 } : {}
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? "Enviando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* ======= OTP INPUT ======= */}
          <TextInput
            style={globalStyles.input}
            placeholder="Código OTP"
            value={otp}
            onChangeText={(text) => { setOtp(text); setOtpError(""); }}
            keyboardType="numeric"
          />
          {otpError ? <Text style={{ color: "red", marginBottom: 5 }}>{otpError}</Text> : null}

          {/* ======= OTP BUTTON ======= */}
          <TouchableOpacity
            style={[
              globalStyles.button,
              verifyingOtp ? { opacity: 0.6 } : {}
            ]}
            onPress={handleVerifyOtp}
            disabled={verifyingOtp}
          >
            <Text style={globalStyles.buttonText}>
              {verifyingOtp ? "Verificando..." : "Verificar código"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Text
        style={[globalStyles.linkText, { marginTop: 10 }]}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        ¿Olvidaste tu contraseña?
      </Text>

      <Text style={globalStyles.linkText} onPress={() => navigation.navigate("Registro")}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}
