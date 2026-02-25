// src/components/admin/UploadMaterials.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

function UploadMaterials() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/admin/materials");
      setMaterials(res.data);
    } catch (err) {
      console.error("Error al obtener materiales:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      if (file) formData.append("file", file);
      if (link) formData.append("link", link);

      await api.post("/admin/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Material subido correctamente.");
      setTitle("");
      setFile(null);
      setLink("");
      setCategory("");
      fetchMaterials();
    } catch (err) {
      console.error("Error al subir material:", err);
      setMessage("❌ Error al subir material.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este material?")) return;
    try {
      await api.delete(`/admin/materials/${id}`);
      setMessage("🗑️ Material eliminado correctamente.");
      fetchMaterials();
    } catch (err) {
      console.error("Error al eliminar material:", err);
      setMessage("❌ Error al eliminar material.");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return "🎬 Video";
      case "pagina":
        return "🌐 Página web";
      case "documento":
        return "📄 Documento";
      case "presentacion":
        return "🖥️ Presentación";
      case "audio":
        return "🎧 Audio";
      case "imagen":
        return "🖼️ Imagen";
      default:
        return "📁 Otro";
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "750px" }}>
      <h3 className="text-center mb-3 fw-semibold">
        <span role="img" aria-label="upload">📤</span> Subir nuevo material
      </h3>

      <form onSubmit={handleSubmit} className="border rounded p-3 shadow-sm bg-light">
        <div className="mb-2">
          <label className="form-label fw-semibold">Título del material</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ejemplo: Guía de Internet Básico"
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Subir archivo</label>
          <input
            type="file"
            className="form-control form-control-sm"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">O incluir enlace</label>
          <input
            type="url"
            className="form-control form-control-sm"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Tipo de material</label>
          <select
            className="form-select form-select-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleccionar tipo...</option>
            <option value="documento">📄 Documento</option>
            <option value="video">🎥 Video</option>
            <option value="pagina">🌐 Página web</option>
            <option value="presentacion">🖥️ Presentación</option>
            <option value="audio">🎧 Audio</option>
            <option value="imagen">🖼️ Imagen</option>
            <option value="otro">📁 Otro</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
          Subir material
        </button>
      </form>

      {message && (
        <div className={`alert mt-3 py-2 ${message.includes("✅") || message.includes("🗑️") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      {/* LISTADO DE MATERIALES */}
      <div className="mt-4">
        <h5 className="fw-semibold mb-2">
          <span role="img" aria-label="materials">📚</span> Materiales subidos
        </h5>
        <ul className="list-group">
          {materials.length > 0 ? (
            materials.map((mat) => (
              <li
                key={mat.id}
                className="list-group-item d-flex justify-content-between align-items-center small py-2"
              >
                <div>
                  <strong>{mat.title}</strong>{" "}
                  <span className="text-muted ms-2">{getTypeIcon(mat.category)}</span>
                  <div className="mt-1">
                    {mat.url && (
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        {mat.type === "file" ? "📄 Ver archivo" : "🔗 Ver enlace"}
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(mat.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item">No hay materiales subidos.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default UploadMaterials;
