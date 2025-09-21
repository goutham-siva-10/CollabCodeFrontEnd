import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const fetchDocuments = () => API.get("/api/documents");
export const fetchDocumentById = (id) => API.get(`/api/documents/${id}`);
export const createDocument = (doc) => API.post("/api/documents", doc);
