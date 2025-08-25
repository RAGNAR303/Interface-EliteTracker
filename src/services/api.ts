import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Pega a URl base do .ENV.LOCAL trasnforma em uma varialvel.
// Exportada para outros arquivos que precisar
