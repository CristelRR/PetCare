import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { getMe, updateProfile } from "../services/api";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({ name: "", phone: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar usuario");
      }
    };
    fetchUser();
  }, []);

  const validateInputs = () => {
    let valid = true;
    let newErrors = { name: "", phone: "" };

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      newErrors.phone = "El teléfono debe tener 10 dígitos numéricos";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      await updateProfile({ name, phone });
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      navigation.replace("Main"); // IMPORTANTE: NO SE QUITÓ
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={globalStyles.container}>
        
        <Text style={globalStyles.title}>Completa tus datos</Text>

        {/* NOMBRE */}
        <TextInput
          style={[
            globalStyles.input,
            errors.name ? { borderColor: "red" } : null,
          ]}
          placeholder="Nombre"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors({ ...errors, name: "" });
          }}
        />
        {errors.name ? (
          <Text style={globalStyles.errorText}>{errors.name}</Text>
        ) : null}

        {/* TELÉFONO */}
        <TextInput
          style={[
            globalStyles.input,
            errors.phone ? { borderColor: "red" } : null,
          ]}
          placeholder="Teléfono (10 dígitos)"
          value={phone}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={(text) => {
            setPhone(text);
            setErrors({ ...errors, phone: "" });
          }}
        />
        {errors.phone ? (
          <Text style={globalStyles.errorText}>{errors.phone}</Text>
        ) : null}

        {/* BOTÓN GUARDAR */}
        <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
          <Text style={globalStyles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
