import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import "./Home.css";

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  const createDocument = async () => {
    if (!title.trim()) {
      console.log("Title is empty");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/documents", {
        title: title.trim(),
        content: "",
      });
      setTitle("");
      fetchDocuments();
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const goToEditor = (id) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div style={{ padding: "2rem" }} className="zoom-container">
      <h2>Create New Document</h2>
      <input
        type="text"
        value={title}
        placeholder="Enter document title"
        onChange={(e) => setTitle(e.target.value)}
        style={{
          marginRight: "1rem",
          padding: "8px",
          width: "250px",
          border: "2px solid #333",
          borderRadius: "4px",
          fontSize: "16px",
          backgroundColor: "#fff",
          color: "#000",
        }}
      />
      <button
        onClick={createDocument}
        style={{
          padding: "8px 16px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Create
      </button>

      <h3>Your Documents</h3>
      <ul>
        {documents.map((doc) => (
          <li
            key={doc.id || doc._id}
            style={{ marginBottom: "10px", cursor: "pointer" }}
            >
            <span
                onClick={() => goToEditor(doc.id || doc._id)}
                style={{
                    marginRight: "10px",
                    textDecoration: "underline",
                    color: "#007bff",
                    fontSize: "1.25rem", // larger size
                    fontWeight: "600",    // semi-bold
                }}
            >
            {doc.title}
            </span>

            <button
                onClick={() => deleteDocument(doc.id || doc._id)}
                style={{
                padding: "4px 8px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                }}
            >
                Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
