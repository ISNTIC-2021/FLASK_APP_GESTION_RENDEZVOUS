import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export function getErrorMessage(err) {
  return err?.response?.data?.error || err.message || "Erreur inconnue";
}