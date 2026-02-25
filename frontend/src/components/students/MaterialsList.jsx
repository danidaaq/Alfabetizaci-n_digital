// src/components/students/MaterialsList.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

function MaterialsList() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/student/materials");
      setMaterials(res.data);
    } catch (err) {
      console.error("Error al obtener materiales:", err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return "🎬";
      case "pagina":
        return "🌐";
      case "documento":
        return "📄";
      case "presentacion":
        return "🖥️";
      case "audio":
        return "🎧";
      case "imagen":
        return "🖼️";
      default:
        return "📘";
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h4 className="text-center mb-3 fw-semibold">
        <span role="img" aria-label="book">📚</span> Materiales disponibles
      </h4>
      <ul className="list-group shadow-sm">
        {materials.length > 0 ? (
          materials.map((mat) => (
            <li
              key={mat.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{getTypeIcon(mat.category)} {mat.title}</strong>
              </div>
              {mat.url && (
                <a
                  href={mat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  {mat.type === "file" ? "📄 Ver archivo" : "🔗 Ver enlace"}
                </a>
              )}
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">No hay materiales disponibles.</li>
        )}
      </ul>
    </div>
  );
}

export default MaterialsList;
