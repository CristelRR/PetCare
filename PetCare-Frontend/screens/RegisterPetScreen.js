import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker"; // Usaremos este
import { globalStyles } from "../styles/globalStyles";
import { registerPet } from "../services/petsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterPetScreen() {
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState([]);
  const [petName, setPetName] = useState("");
  const [petBirth, setPetBirth] = useState(null);
  const [petPhoto, setPetPhoto] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPetPhoto(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setPetBirth(selectedDate);
  };

  const addPet = async () => {
    if (!petName || !petBirth || !petPhoto) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newPet = {
      id: Date.now().toString(),
      name: petName,
      birth: petBirth.toLocaleDateString(),
      photo: petPhoto,
    };

    setPets([...pets, newPet]);

    // Limpiar formulario
    setPetName("");
    setPetBirth(null);
    setPetPhoto(null);
    setShowForm(false);

    // Enviar al backend
    try {
      const ownerId = await AsyncStorage.getItem("userId");
      await registerPet({ name: newPet.name, birth: newPet.birth, photo: newPet.photo, ownerId });
      alert("Mascota registrada correctamente.");
    } catch (error) {
      console.log(error);
      alert("No se pudo registrar la mascota.");
    }
  };

  const renderPetCard = ({ item }) => (
    <View style={{
      backgroundColor: "#FFF",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    }}>
      <Image source={{ uri: item.photo }} style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
        <Text>{item.birth}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, backgroundColor: "#FFF8E7" }}>
      <Text style={globalStyles.title}>Registrar Mascota</Text>

      <TouchableOpacity style={globalStyles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={globalStyles.buttonText}>{showForm ? "Cancelar" : "Agregar Mascota"}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={{ marginVertical: 16 }}>
          <TextInput
            placeholder="Nombre"
            style={globalStyles.input}
            value={petName}
            onChangeText={setPetName}
          />

          {/* Botón para abrir calendario */}
          <TouchableOpacity
            style={globalStyles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: petBirth ? "#000" : "#888", paddingVertical: 10 }}>
              {petBirth ? petBirth.toLocaleDateString() : "Selecciona la fecha de nacimiento"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={petBirth || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TouchableOpacity style={[globalStyles.button, { marginTop: 8 }]} onPress={pickImage}>
            <Text style={globalStyles.buttonText}>{petPhoto ? "Cambiar Foto" : "Seleccionar Foto"}</Text>
          </TouchableOpacity>

          {petPhoto && (
            <Image source={{ uri: petPhoto }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 12, alignSelf: "center" }} />
          )}

          <TouchableOpacity style={globalStyles.button} onPress={addPet}>
            <Text style={globalStyles.buttonText}>Guardar Mascota</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </ScrollView>
  );
}
