// src/screens/LoginScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { loginUser, verifyOtp } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/logo1.png";

// 👁️ IMPORTAMOS ICONOS
import { Feather } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  /* ======================= STATES ======================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  /* ======================= ANIMACIONES ======================= */
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 120, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  /* ======================= VALIDACIONES ======================= */
  const validateEmail = (email) => {
    if (!email) return "Correo obligatorio";
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return "Correo inválido";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Contraseña obligatoria";
    if (password.length < 8) return "Contraseña demasiado corta (mínimo 8)";
    return "";
  };

  const validateOtp = (otp) => {
    if (!otp) return "Ingresa el código OTP";
    if (otp.length !== 6) return "Debe tener 6 dígitos";
    return "";
  };

  /* ======================= LOGIN ======================= */
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    animateButton();

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      shakeInput();
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email, password });
      setOtpSent(true);
    } catch {
      setErrors({ general: "Credenciales incorrectas" });
    }

    setLoading(false);
  };

  /* ======================= VERIFY OTP ======================= */
  const handleVerifyOtp = async () => {
    if (verifyingOtp) return;
    setVerifyingOtp(true);

    const otpError = validateOtp(otp);
    if (otpError) {
      setErrors({ otp: otpError });
      shakeInput();
      setVerifyingOtp(false);
      return;
    }

    try {
      const res = await verifyOtp({ email, otp });

      // 👇👇👇 CAMBIO CLAVE PARA QUE FUNCIONEN LOS LIKES 👇👇👇
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("userId", res.data.user.id.toString());
      // ☝️ user.id viene del backend: authController.verifyOtp

      res.data.user.firstLogin
        ? navigation.replace("Profile")
        : navigation.replace("Main");
    } catch {
      setErrors({ otp: "Código incorrecto o expirado" });
    }

    setVerifyingOtp(false);
  };

  /* ======================= RENDER ======================= */
  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.Image
        source={logo}
        style={[globalStyles.logo, { transform: [{ scale: buttonScale }] }]}
        resizeMode="contain"
      />

      <Text style={globalStyles.title}>Iniciar Sesión</Text>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        {!otpSent ? (
          <>
            {/* EMAIL */}
            <TextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                const msg = validateEmail(t);
                setErrors((prev) => ({ ...prev, email: msg }));
              }}
              style={[
                globalStyles.input,
                errors.email ? { borderColor: "red" } : email ? { borderColor: "green" } : null,
              ]}
            />
            {errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}

            {/* PASSWORD + OJITO */}
            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  const msg = validatePassword(t);
                  setErrors((prev) => ({ ...prev, password: msg }));
                }}
                style={[
                  globalStyles.input,
                  errors.password ? { borderColor: "red" } : password ? { borderColor: "green" } : null,
                ]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: 14 }}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}

            {/* BOTÓN */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[globalStyles.button, loading && { opacity: 0.6 }]}
                disabled={loading}
                onPress={handleLogin}
              >
                <Text style={globalStyles.buttonText}>
                  {loading ? "Enviando..." : "Iniciar Sesión"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : (
          <>
            <TextInput
              style={globalStyles.input}
              placeholder="Código OTP"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={(t) => {
                setOtp(t);
                const msg = validateOtp(t);
                setErrors((prev) => ({ ...prev, otp: msg }));
              }}
            />
            {errors.otp && <Text style={globalStyles.errorText}>{errors.otp}</Text>}

            <TouchableOpacity
              style={[globalStyles.button, verifyingOtp && { opacity: 0.6 }]}
              onPress={handleVerifyOtp}
              disabled={verifyingOtp}
            >
              <Text style={globalStyles.buttonText}>
                {verifyingOtp ? "Verificando..." : "Verificar código"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>

      {/* LINKS */}
      <Text style={globalStyles.linkText} onPress={() => navigation.navigate("ForgotPassword")}>
        ¿Olvidaste tu contraseña?
      </Text>

      <Text style={globalStyles.linkText} onPress={() => navigation.navigate("Registro")}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </KeyboardAvoidingView>
  );
}
