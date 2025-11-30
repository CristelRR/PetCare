import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { getMe, updateProfile } from "../services/api";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
      } catch {
        Alert.alert("Error", "No se pudo cargar usuario");
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({ name, phone });
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      navigation.replace("Main"); //   Ir al menú principal
    } catch {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Completa tus datos</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
        <Text style={globalStyles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}
