import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createPost } from "../services/communityApi";
import { globalStyles } from "../styles/globalStyles";

export default function CreatePostScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("❌ Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo abrir la galería");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!image) return Alert.alert("Error", "Selecciona una imagen");

      const token = await AsyncStorage.getItem("token");

      const form = new FormData();
      form.append("image", {
        uri: Platform.OS === "android" ? image : image.replace("file://", ""),
        name: "photo.jpg",
        type: "image/jpeg",
      });

      form.append("description", description);

      await createPost(form, token);

      Alert.alert("Éxito", "Publicación creada");
      navigation.goBack();
    } catch (error) {
      console.log("❌ ERROR AL SUBIR:", error);
      Alert.alert("Error", "No se pudo subir la publicación");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={globalStyles.title}>Crear Publicación</Text>

      <TouchableOpacity
        style={[globalStyles.button, { marginVertical: 10 }]}
        onPress={pickImage}
      >
        <Text style={globalStyles.buttonText}>Seleccionar Foto</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: 250, borderRadius: 10, marginVertical: 10 }}
        />
      )}

      <TextInput
        placeholder="Descripción..."
        style={[globalStyles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
        <Text style={globalStyles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}
