import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../styles/globalStyles";
import { theme } from "../styles/theme";
import { getPets } from "../services/petsApi";
import { getPetHistory, addPetRecord } from "../services/historyApi";
import AddRecordModal from "../components/AddRecordModal";

export default function PetDetailsScreen() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recordType, setRecordType] = useState("");

  const loadPets = async () => {
    try {
      const res = await getPets();
      setPets(res.data || []);
    } catch (error) {
      console.log("Error cargando mascotas:", error);
    }
  };

  const loadHistory = async (petId) => {
    try {
      setLoading(true);
      const res = await getPetHistory(petId);
      setHistory(res.data || {});
    } catch (error) {
      console.log("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (selectedPet) loadHistory(selectedPet._id);
  }, [selectedPet]);

  const openModal = (type) => {
    setRecordType(type);
    setModalVisible(true);
  };

  const handleAddRecord = async (type, formData) => {
  try {
    await addPetRecord(selectedPet._id, type, formData);
    Alert.alert("Éxito", "Registro agregado correctamente");
    setModalVisible(false);
    loadHistory(selectedPet._id);
  } catch (error) {
    Alert.alert("Error", "No se pudo guardar el registro.");
  }
};


  return (
    <ScrollView style={styles.container}>
      <Text style={globalStyles.title}>Detalles de Mascota</Text>

      <Text style={styles.pickerLabel}>Selecciona una mascota:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedPet?._id || ""}
          onValueChange={(value) => {
            const pet = pets.find((p) => p._id === value);
            setSelectedPet(pet);
          }}
        >
          <Picker.Item label="-- Selecciona --" value="" />
          {pets.map((pet) => (
            <Picker.Item key={pet._id} label={pet.name} value={pet._id} />
          ))}
        </Picker>
      </View>

      {selectedPet && (
        <View style={styles.card}>
          {selectedPet.photo && (
            <Image source={{ uri: selectedPet.photo }} style={styles.petImage} />
          )}
          <Text style={styles.infoLabel}>🐶 Raza: {selectedPet.breed || "-"}</Text>
          <Text style={styles.infoLabel}>
            🎂 Fecha de nacimiento:{" "}
            {selectedPet.birthDate
              ? new Date(selectedPet.birthDate).toLocaleDateString()
              : "-"}
          </Text>
          <Text style={styles.infoLabel}>⚧ Sexo: {selectedPet.sex || "-"}</Text>
          <Text style={styles.infoLabel}>🎨 Color: {selectedPet.color || "-"}</Text>
          <Text style={styles.infoLabel}>
            🐾 Señas particulares: {selectedPet.marks || "-"}
          </Text>
        </View>
      )}

      {loading && <ActivityIndicator color="#333" />}

      {selectedPet && history && (
        <>
          <Text style={styles.sectionTitle}>Vacunación</Text>
          {history.vaccinations?.length ? (
            history.vaccinations.map((v, i) => (
              <Text key={i} style={styles.recordText}>
                {new Date(v.date).toLocaleDateString()} - {v.vaccine} (Lote:{" "}
                {v.batch || "N/A"})
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>Sin registros aún</Text>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal("vaccination")}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Desparasitación</Text>
          {history.deworming?.length ? (
            history.deworming.map((d, i) => (
              <Text key={i} style={styles.recordText}>
                {new Date(d.date).toLocaleDateString()} - {d.product} ({d.dose})
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>Sin registros aún</Text>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal("deworming")}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Tratamientos</Text>
          {history.treatments?.length ? (
            history.treatments.map((t, i) => (
              <Text key={i} style={styles.recordText}>
                {new Date(t.date).toLocaleDateString()} - {t.treatment}
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>Sin registros aún</Text>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal("treatment")}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Historia Clínica</Text>
          {history.clinicalHistory?.length ? (
            history.clinicalHistory.map((h, i) => (
              <Text key={i} style={styles.recordText}>
                {new Date(h.date).toLocaleDateString()} - {h.description}
              </Text>
            ))
          ) : (
            <Text style={styles.emptyText}>Sin registros aún</Text>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal("clinical")}
          >
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </>
      )}

      <AddRecordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddRecord}
      />
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.m,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.s,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerLabel: {
    fontWeight: "bold",
    marginBottom: 6,
    color: theme.colors.text,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    marginVertical: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: "#444",
    marginVertical: 2,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
    paddingBottom: 4,
  },
  recordText: {
    fontSize: 15,
    color: "#333",
    marginVertical: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
  },
};
