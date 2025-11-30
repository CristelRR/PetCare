import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "../styles/globalStyles";
import { registerPet, getPets, identifyPetPhoto } from "../services/petsApi";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export default function RegisterPetScreen() {
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Campos del formulario
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");
  const [color, setColor] = useState("");
  const [marks, setMarks] = useState("");
  const [photo, setPhoto] = useState(null);

 useFocusEffect(
  useCallback(() => {
    loadPets(); //    recarga la lista cada vez que abres esta pestaña
  }, [])
);


  const loadPets = async () => {
    try {
      setLoading(true);
      const res = await getPets();
      setPets(res.data || []);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudieron cargar las mascotas.");
    } finally {
      setLoading(false);
    }
  };

const pickImage = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permiso denegado", "Debes otorgar permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
});


    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setPhoto(uri);

    try {
  const aiResult = await identifyPetPhoto(uri);
  console.log("🧠 Resultado IA (frontend):", aiResult);

  const label =
    aiResult?.predictedLabel ||
    aiResult?.label ||
    aiResult?.result?.predictedLabel ||
    aiResult?.result?.label ||
    "Desconocido";

  const score =
    aiResult?.confidence ??
    aiResult?.score ??
    aiResult?.result?.confidence ??
    aiResult?.result?.score ??
    0;

  console.log("  Label detectado:", label);
  console.log("  Score detectado:", score);

  setBreed(label);

  Alert.alert(
    "Resultado de IA",
    `Parece que es un ${label} (${(score * 100).toFixed(1)}% de confianza)`
  );
} catch (error) {
  console.log("⚠️ Error IA:", error);
  Alert.alert("Error", "No se pudo identificar la imagen.");
}

  } catch (error) {
    console.error("   Error en pickImage:", error);
  }
};


  const addPet = async () => {
    if (!name) {
      Alert.alert("Campos obligatorios", "Debes ingresar al menos el nombre.");
      return;
    }

    try {
      await registerPet({ name, breed, birthDate, sex, color, marks, photo });
      Alert.alert("Éxito", "Mascota registrada correctamente.");

      setName("");
      setBreed("");
      setBirthDate("");
      setSex("");
      setColor("");
      setMarks("");
      setPhoto(null);
      setShowForm(false);
      loadPets(); //   recarga lista
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo registrar la mascota.");
    }
  };

  const renderPetCard = ({ item }) => (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
      {item.breed && <Text>Raza: {item.breed}</Text>}
      {item.birthDate && (
        <Text>
          Nacimiento: {new Date(item.birthDate).toLocaleDateString()}
        </Text>
      )}
      {item.sex && <Text>Sexo: {item.sex}</Text>}
      {item.color && <Text>Color: {item.color}</Text>}
      {item.marks && <Text>Señas: {item.marks}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFF8E7" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      >
        <Text style={globalStyles.title}>Registrar Mascota</Text>

        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={globalStyles.buttonText}>
            {showForm ? "Cancelar" : "Agregar Mascota"}
          </Text>
        </TouchableOpacity>

        {showForm && (
          <View style={{ marginVertical: 16 }}>
            <TextInput
              placeholder="Nombre"
              style={globalStyles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Raza"
              style={globalStyles.input}
              value={breed}
              onChangeText={setBreed}
            />
            <TextInput
              placeholder="Fecha de nacimiento (YYYY-MM-DD)"
              style={globalStyles.input}
              value={birthDate}
              onChangeText={setBirthDate}
            />
            <TextInput
              placeholder="Sexo (Hembra / Macho)"
              style={globalStyles.input}
              value={sex}
              onChangeText={setSex}
            />
            <TextInput
              placeholder="Color"
              style={globalStyles.input}
              value={color}
              onChangeText={setColor}
            />
            <TextInput
              placeholder="Señas particulares"
              style={globalStyles.input}
              value={marks}
              onChangeText={setMarks}
            />

            <TouchableOpacity
              style={[globalStyles.button, { marginVertical: 8 }]}
              onPress={pickImage}
            >
              <Text style={globalStyles.buttonText}>
                {photo ? "Cambiar Foto" : "Seleccionar Foto"}
              </Text>
            </TouchableOpacity>

            {photo && (
              <Image
                source={{ uri: photo }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  alignSelf: "center",
                  marginBottom: 8,
                }}
              />
            )}

            <TouchableOpacity style={globalStyles.button} onPress={addPet}>
              <Text style={globalStyles.buttonText}>Guardar Mascota</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[globalStyles.title, { marginTop: 16 }]}>Mis Mascotas</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#333" style={{ marginTop: 20 }} />
        ) : pets.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No hay mascotas registradas.
          </Text>
        ) : (
          pets.map((pet) => <View key={pet._id}>{renderPetCard({ item: pet })}</View>)
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
