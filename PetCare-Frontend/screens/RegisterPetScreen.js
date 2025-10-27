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

export default function RegisterPetScreen() {
  const [showForm, setShowForm] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const res = await getPets();
      setPets(res.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudieron cargar las mascotas.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función corregida para abrir la galería y usar IA
  const pickImage = async () => {
    try {
      // Pedimos permisos antes
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Debes otorgar permiso para acceder a la galería."
        );
        return;
      }

      // Abrimos la galería (forma que ya te funcionaba)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ el correcto
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhoto(uri);

        try {
          // Llamamos a la IA (solo después de que se haya elegido una imagen)
          const aiResult = await identifyPetPhoto(uri);
          console.log("🔍 Resultado IA:", aiResult);

          Alert.alert(
            "Resultado de IA",
            `Parece que es un ${aiResult.predictedLabel} (${(
              aiResult.confidence * 100
            ).toFixed(1)}% de confianza)`
          );

          // Rellenar especie automáticamente (opcional)
          setSpecies(aiResult.predictedLabel);
        } catch (error) {
          console.log("⚠️ Error IA:", error);
          Alert.alert("Error", "No se pudo identificar la imagen.");
        }
      }
    } catch (error) {
      console.error("🚨 Error en pickImage:", error);
    }
  };

  const addPet = async () => {
    if (!name || !species) {
      Alert.alert("Campos obligatorios", "Debes ingresar nombre y especie.");
      return;
    }

    try {
      await registerPet({ name, species, breed, age: Number(age), photo });
      Alert.alert("Éxito", "Mascota registrada correctamente.");
      setName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setPhoto(null);
      setShowForm(false);
      loadPets();
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
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {item.photo && (
        <Image
          source={{ uri: item.photo }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            marginRight: 12,
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
        <Text>Especie: {item.species}</Text>
        {item.breed && <Text>Raza: {item.breed}</Text>}
        {item.age && <Text>Edad: {item.age} años</Text>}
      </View>
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
              placeholder="Especie (Perro, Gato...)"
              style={globalStyles.input}
              value={species}
              onChangeText={setSpecies}
            />
            <TextInput
              placeholder="Raza (opcional)"
              style={globalStyles.input}
              value={breed}
              onChangeText={setBreed}
            />
            <TextInput
              placeholder="Edad (opcional)"
              style={globalStyles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
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
