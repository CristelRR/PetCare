import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
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

  // ======== CARGAR MASCOTAS ========
  const loadPets = async () => {
    try {
      const res = await getPets();
      setPets(res.data || []);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las mascotas");
    }
  };

  // ======== CARGAR HISTORIAL ========
  const loadHistory = async (petId) => {
    try {
      setLoading(true);
      const res = await getPetHistory(petId);
      setHistory(res.data || {});
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el historial");
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

      {/* ========== PICKER ========== */}
      <Text style={styles.pickerLabel}>Selecciona tu mascota:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedPet?._id || ""}
          onValueChange={(value) => {
            const pet = pets.find((p) => p._id === value);
            setSelectedPet(pet);
          }}
        >
          <Picker.Item label="-- Elegir --" value="" />
          {pets.map((pet) => (
            <Picker.Item key={pet._id} label={pet.name} value={pet._id} />
          ))}
        </Picker>
      </View>

      {/* ========== INFO DE LA MASCOTA ========== */}
      {selectedPet && (
        <View style={styles.card}>
          {selectedPet.photo && (
            <Image source={{ uri: selectedPet.photo }} style={styles.petImage} />
          )}

          <Text style={styles.infoLabel}>🐶 Nombre: {selectedPet.name}</Text>
          <Text style={styles.infoLabel}>📌 Raza: {selectedPet.breed || "-"}</Text>
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

      {/* ========== LOADING ========== */}
      {loading && <ActivityIndicator color={theme.colors.primary} size="large" />}

      {/* ========== HISTORIAL ========== */}
      {selectedPet && history && (
        <>
          {renderSection("Vacunación", history.vaccinations, "vaccine", openModal)}
          {renderSection("Desparasitación", history.deworming, "deworming", openModal)}
          {renderSection("Tratamientos", history.treatments, "treatment", openModal)}
          {renderSection("Historia Clínica", history.clinicalHistory, "clinical", openModal)}
        </>
      )}

      {/* ========== MODAL ========== */}
      <AddRecordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddRecord}
      />
    </ScrollView>
  );
}

// ==================== COMPONENTE PARA REPETIR SECCIONES ====================
function renderSection(title, records, type, openModal) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>

      {records?.length ? (
        records.map((item, i) => (
          <Text key={i} style={styles.recordText}>
            📅 {new Date(item.date).toLocaleDateString()}  
            {"  "} ➤ {item.vaccine || item.product || item.treatment || item.description}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>Sin registros aún</Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => openModal(type)}>
        <Text style={styles.addButtonText}>+ Agregar registro</Text>
      </TouchableOpacity>
    </>
  );
}

// ==================== ESTILOS ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  pickerLabel: {
    fontWeight: "bold",
    marginTop: 10,
    color: theme.colors.text,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginVertical: 10,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.m,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.s,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  petImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignSelf: "center",
    marginVertical: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: "#444",
    marginVertical: 3,
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
    marginVertical: 3,
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
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
