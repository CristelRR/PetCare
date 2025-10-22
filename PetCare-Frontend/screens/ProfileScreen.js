import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { getMe, updateProfile } from "../services/api";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
        setAvatar(res.data.avatar || "");
      } catch {
        Alert.alert("Error", "No se pudo cargar usuario");
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({ name, phone, avatar });
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      navigation.navigate("Main", { screen: "Home" }); 
    } catch {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Personaliza tu perfil</Text>
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
      <TextInput
        style={globalStyles.input}
        placeholder="Avatar (URL)"
        value={avatar}
        onChangeText={setAvatar}
      />
      <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
        <Text style={globalStyles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}
