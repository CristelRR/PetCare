import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


import { globalStyles } from "../styles/globalStyles";
import { getPets } from "../services/petsApi";
import { getPosts, likePost } from "../services/communityApi";
import { API_URL } from "@env";

export default function HomeScreen({ navigation }) {

  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);

  // 👉 Quita /api para mostrar imágenes
  const BASE_URL = API_URL.replace("/api", "");

  useFocusEffect(
  useCallback(() => {
    loadPets();
    loadPosts();
  }, [])
);

  const loadPets = async () => {
    try {
      const res = await getPets();
      setPets(res.data);
    } catch (error) {
      console.log("Error cargando mascotas:", error);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (error) {
      console.log("Error cargando posts:", error);
    }
  };

  // 👍 Corrección: enviar el token
  const handleLike = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await likePost(id, token);
      loadPosts();
    } catch (error) {
      console.log("Error al dar like:", error);
    }
  };

  const renderPost = ({ item }) => (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: 20,
        borderRadius: 16,
        padding: 12,
      }}
    >
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
        {item.userName}
      </Text>

      {/* 👍 Corrección URL correcta */}
      <Image
        source={{ uri: `${BASE_URL}${item.imageUrl}` }}
        style={{
          width: "100%",
          height: 280,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />

      <TouchableOpacity onPress={() => handleLike(item._id)}>
        <Text style={{ fontSize: 16 }}>❤️ {item.likes.length} Me gusta</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 10 }}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: "#FFF8E7" }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          marginTop: 20,
          marginLeft: 16,
        }}
      >
        Mis Mascotas 🐾
      </Text>

      <ScrollView
        horizontal
        style={{ marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {/* Tarjeta "Agregar mascota" */}
        <TouchableOpacity
          style={{
            width: 180,
            height: 210,
            backgroundColor: "#F9C74F",
            borderRadius: 20,
            marginLeft: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("RegisterPet")}
        >
          <Text style={{ fontSize: 40 }}>+</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Agregar Mascota
          </Text>
        </TouchableOpacity>

        {pets.map((pet) => (
          <TouchableOpacity
            key={pet._id}
            style={{
              width: 180,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 10,
              marginLeft: 16,
            }}
            onPress={() =>
              navigation.navigate("PetDetails", { petId: pet._id })
            }
          >
            {pet.photo ? (
              <Image
                source={{ uri: pet.photo }}
                style={{
                  width: "100%",
                  height: 130,
                  borderRadius: 15,
                  marginBottom: 10,
                }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: 130,
                  backgroundColor: "#eaeaea",
                  borderRadius: 15,
                  marginBottom: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Sin foto</Text>
              </View>
            )}

            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{pet.name}</Text>
            <Text style={{ color: "gray" }}>{pet.breed}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ---------------- COMUNIDAD ---------------- */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          marginTop: 30,
          marginLeft: 16,
        }}
      >
        Comunidad PetCare 📸
      </Text>

      <TouchableOpacity
        style={[globalStyles.button, { marginHorizontal: 16, marginTop: 10 }]}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={globalStyles.buttonText}>Subir Foto</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        contentContainerStyle={{ padding: 16 }}
      />
    </ScrollView>
  );
}
