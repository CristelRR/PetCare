import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../styles/theme";
import { globalStyles } from "../styles/globalStyles";

export default function AddRecordModal({ visible, onClose, onSave }) {
  const [selectedType, setSelectedType] = useState("vaccination"); // valor por defecto
  const [formData, setFormData] = useState({
    date: "",
    vaccine: "",
    batch: "",
    product: "",
    dose: "",
    nextDate: "",
    treatment: "",
    description: "",
    puppies: "",
  });

  useEffect(() => {
    if (!visible) {
      setFormData({
        date: "",
        vaccine: "",
        batch: "",
        product: "",
        dose: "",
        nextDate: "",
        treatment: "",
        description: "",
        puppies: "",
      });
      setSelectedType("vaccination");
    }
  }, [visible]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.date) {
      Alert.alert("Campo obligatorio", "La fecha es obligatoria.");
      return;
    }

    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );

    onSave(selectedType, cleanData);
  };

  const renderFields = () => {
    switch (selectedType) {
      case "vaccination":
        return (
          <>
            <TextInput
              style={globalStyles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(v) => handleChange("date", v)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Vacuna"
              value={formData.vaccine}
              onChangeText={(v) => handleChange("vaccine", v)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Lote"
              value={formData.batch}
              onChangeText={(v) => handleChange("batch", v)}
            />
          </>
        );
      case "deworming":
        return (
          <>
            <TextInput
              style={globalStyles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(v) => handleChange("date", v)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Producto"
              value={formData.product}
              onChangeText={(v) => handleChange("product", v)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Dosis"
              value={formData.dose}
              onChangeText={(v) => handleChange("dose", v)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Próxima fecha (YYYY-MM-DD)"
              value={formData.nextDate}
              onChangeText={(v) => handleChange("nextDate", v)}
            />
          </>
        );
      case "treatment":
        return (
          <>
            <TextInput
              style={globalStyles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(v) => handleChange("date", v)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Tratamiento"
              value={formData.treatment}
              onChangeText={(v) => handleChange("treatment", v)}
            />
          </>
        );
      case "clinical":
        return (
          <>
            <TextInput
              style={globalStyles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(v) => handleChange("date", v)}
            />
            <TextInput
              style={[globalStyles.input, { height: 100 }]}
              placeholder="Descripción"
              value={formData.description}
              multiline
              onChangeText={(v) => handleChange("description", v)}
            />
          </>
        );
      case "birth":
        return (
          <>
            <TextInput
              style={globalStyles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(v) => handleChange("date", v)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Número de crías"
              keyboardType="numeric"
              value={formData.puppies}
              onChangeText={(v) => handleChange("puppies", v)}
            />
          </>
        );
      default:
        return <Text>No hay campos para este tipo.</Text>;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>Nuevo Registro</Text>

            {/*   Selector de tipo de registro */}
            <Text style={styles.label}>Tipo de registro:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(value) => setSelectedType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Vacunación" value="vaccination" />
                <Picker.Item label="Desparasitación" value="deworming" />
                <Picker.Item label="Tratamiento" value="treatment" />
                <Picker.Item label="Historial Clínico" value="clinical" />
                <Picker.Item label="Parto" value="birth" />
              </Picker>
            </View>

            {renderFields()}

            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>  Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 45,
    width: "100%",
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: theme.colors.danger,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
});
