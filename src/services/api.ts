import axios from "axios";
import { useLocalStorageKey } from "../hooks/use.user";

// Pega a URl base do .ENV.LOCAL trasnforma em uma varialvel.
// Exportada para outros arquivos que precisar
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Passando o token do usuario na aplicação
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem(useLocalStorageKey);

  const token = userData && JSON.parse(userData).token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log({ config });
  return config;
});
