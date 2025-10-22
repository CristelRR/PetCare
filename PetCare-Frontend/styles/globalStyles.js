// src/styles/globalStyles.js
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    //justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.l,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: theme.radius.m,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: theme.spacing.m,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.m,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: theme.spacing.s,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: theme.colors.secondary,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});
