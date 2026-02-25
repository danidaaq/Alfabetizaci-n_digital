// src/components/admin/CreateActivities.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

function CreateActivities() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("quiz");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [docs, setDocs] = useState([]);
  const [link, setLink] = useState ("");
  const [questions, setQuestions] = useState([{ q: "", options: ["", ""], correct: 0 }]);
  const [loading, setLoading] = useState(false);
  const [adminActivities, setAdminActivities] = useState([]);

  useEffect(() => {
    fetchAdminActivities();
  }, []);

  const fetchAdminActivities = async () => {
    try {
      const res = await api.get("/admin/activities");
      setAdminActivities(res.data);
    } catch (err) {
      console.error("Error al cargar actividades:", err);
      alert("❌ Error al cargar las actividades");
    }
  };

  // archivos
  const handleImages = (e) => setImages(Array.from(e.target.files || []));
  const handleDocs = (e) => setDocs(Array.from(e.target.files || []));

  // preguntas
  const addQuestion = () => setQuestions(s => [...s, { q: "", options: ["", ""], correct: 0 }]);
  const removeQuestion = (i) => setQuestions(s => s.filter((_, idx) => idx !== i));

  const updateQuestion = (i, field, value) => {
    setQuestions(s => s.map((qq, idx) => idx === i ? { ...qq, [field]: value } : qq));
  };

  const addOption = (qIdx) => {
    setQuestions(s => s.map((qq, idx) => idx === qIdx ? { ...qq, options: [...qq.options, ""] } : qq));
  };

  const removeOption = (qIdx, optIdx) => {
    setQuestions(s => s.map((qq, idx) => {
      if (idx !== qIdx) return qq;
      const newOpts = qq.options.filter((_, oi) => oi !== optIdx);
      let newCorrect = qq.correct;
      if (newCorrect >= newOpts.length) newCorrect = newOpts.length - 1;
      return { ...qq, options: newOpts, correct: newCorrect };
    }));
  };

  const updateOption = (qIdx, optIdx, value) => {
    setQuestions(s => s.map((qq, idx) => idx === qIdx ? { ...qq, options: qq.options.map((o, oi) => oi === optIdx ? value : o) } : qq));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Ingrese un título");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("description", description || "");

      if (type === "quiz") {
        // enviamos preguntas y (opcional) respuestas correctas
        const qPayload = questions.map(q => ({ q: q.q, options: q.options }));
        const aPayload = questions.map(q => q.correct ?? 0);
        formData.append("questions", JSON.stringify(qPayload));
        formData.append("answers", JSON.stringify(aPayload));
      }

      images.forEach((f) => formData.append("images[]", f));
      docs.forEach((f) => formData.append("docs[]", f));

      if (type === "link") {
        if (!link.trim()) {
          setLoading(false);
          return alert("Ingrese un enlace válido");
        }
        formData.append("link", link);
      }

      await api.post("/admin/activities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Actividad creada correctamente");
      // limpiar
      setTitle("");
      setType("quiz");
      setDescription("");
      setImages([]);
      setDocs([]);
      setLink("");
      setQuestions([{ q: "", options: ["", ""], correct: 0 }]);
      fetchAdminActivities();
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Error al crear la actividad";
      // Si hay errores de validación, mostraremos detalles si existen
      if (err?.response?.data) {
        if (err.response.data.errors) {
          const v = err.response.data.errors;
          const first = Object.values(v)[0];
          alert("❌ " + (first && first[0] ? first[0] : message));
        } else {
          alert("❌ " + message);
        }
      } else {
        alert("❌ Error al crear actividad");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar actividad?")) return;
    try {
      await api.delete(`/admin/activities/${id}`);
      fetchAdminActivities();
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar la actividad");
    }
  };

  return (
    <div>
      <h4 className="mb-3">🧩 Crear nueva actividad</h4>

      <form onSubmit={handleSubmit}>
        <div className="card p-3 mb-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Clase 1 - Actividad" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de actividad</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="quiz">Cuestionario</option>
              <option value="image">Imagen (mostrar en página)</option>
              <option value="document">Documento</option>
              <option value="link">Enlace</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción (opcional)</label>
            <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Subir imágenes (opcional)</label>
            <input type="file" accept="image/*" multiple className="form-control" onChange={handleImages} />
            {images.length > 0 && <small className="text-muted">{images.length} archivo(s) seleccionado(s)</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Subir documentos (opcional)</label>
            <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" multiple className="form-control" onChange={handleDocs} />
            {docs.length > 0 && <small className="text-muted">{docs.length} archivo(s) seleccionado(s)</small>}
          </div>

        {type === "link" && (
          <div className="mb-3">
            <label className="form-label">Enlace</label>
            <input type="url" className="form-control" placeholder="https://ejemplo.com" value={link} onChange={(e) => setLink(e.target.value)} required />
          </div> 
        )}
        </div>

        {type === "quiz" && (
          <div className="card p-3 mb-4 shadow-sm">
            <h5 className="mb-3">✍️ Preguntas (Cuestionario)</h5>
            {questions.map((q, i) => (
              <div key={i} className="mb-3 border rounded p-2">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <strong>Pregunta {i + 1}</strong>
                  <div>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeQuestion(i)} disabled={questions.length <= 1}>Eliminar</button>
                  </div>
                </div>

                <input className="form-control mb-2" placeholder={`Pregunta ${i + 1}`} value={q.q} onChange={(e) => updateQuestion(i, "q", e.target.value)} required />

                <div className="mb-2">
                  <label className="form-label mb-1">Opciones</label>
                  {q.options.map((opt, oi) => (
                    <div className="input-group mb-1" key={oi}>
                      <span className="input-group-text">
                        <input type="radio" name={`correct-${i}`} checked={q.correct === oi} onChange={() => updateQuestion(i, "correct", oi)} />
                      </span>
                      <input className="form-control" value={opt} onChange={(e) => updateOption(i, oi, e.target.value)} placeholder={`Opción ${oi + 1}`} />
                      <button type="button" className="btn btn-outline-danger" onClick={() => removeOption(i, oi)} disabled={q.options.length <= 2}>🗑</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addOption(i)}>Agregar opción</button>
                </div>
              </div>
            ))}

            <div>
              <button type="button" className="btn btn-sm btn-primary" onClick={addQuestion}>+ Agregar pregunta</button>
            </div>
          </div>
        )}

        <div className="d-grid">
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creando..." : "Crear actividad"}</button>
        </div>
      </form>

      <hr />

      <h5>📋 Actividades creadas</h5>
      <ul className="list-group mt-3">
        {adminActivities.length === 0 && <li className="list-group-item">No hay actividades creadas.</li>}
        {adminActivities.map((a) => (
          <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{a.title}</strong> <div className="small text-muted">{a.type}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(a.id)}>Eliminar</button>
              <a className="btn btn-sm btn-outline-primary" href={`/admin/activities/${a.id}`} onClick={(e)=>{ e.preventDefault(); window.alert("Si quieres ver detalle implementa un modal o ruta /admin/activities/{id}"); }}>Ver</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateActivities;
