// src/screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import { globalStyles } from "../styles/globalStyles";
import { getPets } from "../services/petsApi";
import { getPosts, likePost } from "../services/communityApi";
import { API_URL } from "@env";

export default function HomeScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");

  // Quitar /api para las fotos
  const BASE_URL = API_URL.replace("/api", "");

  // 🧠 Obtener userId para saber si ya dio like
  useEffect(() => {
    const getId = async () => {
      const uid = await AsyncStorage.getItem("userId");
      setUserId(uid || "");
    };
    getId();
  }, []);

  // Cargar mascotas y posts cuando entras a la pantalla
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

  // 🔥 LIKE-DISLIKE – SOLO ACTUALIZA EL POST TOCADO
  const handleLike = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await likePost(id, token);

      setPosts((prev) =>
        prev.map((p) => (p._id === id ? res.data.post : p))
      );
    } catch (error) {
      console.log("Error al dar like:", error.response?.data || error);
    }
  };

  /* ======================= RENDER POST ======================= */
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postUser}>{item.userId?.name || "Usuario"}</Text>

      <Image
        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        style={styles.postImage}
      />

      <TouchableOpacity
        onPress={() => handleLike(item._id)}
        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
      >
        <Icon
          name={item.likes.includes(userId) ? "heart" : "heart-outline"}
          size={24}
          color="#F9844A"
        />
        <Text style={styles.likesText}>{item.likes.length} Me gusta</Text>
      </TouchableOpacity>

      <Text style={styles.postDescription}>{item.description}</Text>
    </View>
  );

  /* ======================= RENDER ======================= */
  return (
    <ScrollView style={{ backgroundColor: "#FFF8E7" }}>
      
      {/* ---------- SECCIÓN MASCOTAS ---------- */}
      <Text style={styles.sectionTitle}>Mis Mascotas</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {/* TARJETA AGREGAR MASCOTA */}
        <TouchableOpacity
          style={styles.addPetCard}
          onPress={() => navigation.navigate("RegisterPet")}
        >
          <Text style={styles.addPlus}>+</Text>
          <Text style={styles.addText}>Agregar Mascota</Text>
        </TouchableOpacity>

        {/* LISTADO DE MASCOTAS */}
        {pets.map((pet) => (
          <TouchableOpacity
            key={pet._id}
            style={styles.petCard}
            onPress={() =>
              navigation.navigate("PetDetails", { petId: pet._id })
            }
          >
            {pet.photo ? (
              <Image source={{ uri: pet.photo }} style={styles.petImage} />
            ) : (
              <View style={styles.petNoImage}>
                <Text style={{ color: "#666" }}>Sin foto</Text>
              </View>
            )}
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ---------- SECCIÓN COMUNIDAD ---------- */}
      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
        Comunidad PetCare
      </Text>

      <TouchableOpacity
        style={[globalStyles.button, { marginHorizontal: 16, marginTop: 10 }]}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={globalStyles.buttonText}>Subir Foto</Text>
      </TouchableOpacity>

      {/* ---------- POSTS ---------- */}
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

/* ======================= ESTILOS ======================= */

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 16,
    color: "#333",
  },

  /* ----- MASCOTAS ----- */
  addPetCard: {
    width: 180,
    height: 210,
    backgroundColor: "#F9C74F",
    borderRadius: 20,
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  addPlus: { fontSize: 42, fontWeight: "bold", color: "#333", marginBottom: 5 },
  addText: { fontSize: 16, fontWeight: "600", color: "#333" },

  petCard: {
    width: 180,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    marginLeft: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  petImage: { width: "100%", height: 130, borderRadius: 15, marginBottom: 10 },
  petNoImage: {
    width: "100%",
    height: 130,
    backgroundColor: "#ECECEC",
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  petName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  petBreed: { color: "gray", fontSize: 14 },

  /* ----- POST ----- */
  postCard: {
    backgroundColor: "white",
    marginBottom: 20,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  postUser: { fontWeight: "bold", marginBottom: 6, fontSize: 16, color: "#333" },
  postImage: { width: "100%", height: 280, borderRadius: 10, marginBottom: 10 },
  likesText: { fontSize: 15, marginLeft: 6, color: "#333", fontWeight: "500" },
  postDescription: { marginTop: 8, color: "#555" },
});
