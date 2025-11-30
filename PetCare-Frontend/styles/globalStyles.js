// src/styles/globalStyles.js
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
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
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: theme.spacing.s,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  inputFocus: {
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },

  errorText: {
    color: theme.colors.danger,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
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

  logo: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginBottom: theme.spacing.l,
  },
});
