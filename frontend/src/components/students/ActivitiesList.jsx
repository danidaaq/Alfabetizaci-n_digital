// src/components/students/ActivitiesList.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [current, setCurrent] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/student/activities");
      setActivities(res.data);
    } catch (err) {
      console.error("Error obteniendo actividades:", err);
    }
  };

  const openActivity = (act) => {
    setCurrent(act);
    if (act.type === "quiz" && act.questions) {
      const initial = {};
      act.questions.forEach((q, i) => (initial[i] = ""));
      setAnswers(initial);
    } else {
      setAnswers({});
    }
  };

  const handleAnswerChange = (qIdx, value) => {
    setAnswers((s) => ({ ...s, [qIdx]: value }));
  };

  // Construye URL del recurso (si guardaste path relativo)
  const resourceUrl = (r) => {
    if (!r) return "";
    const path = r.path ?? r.url ?? r;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    // si backend guardó 'activities/images/xxx' o 'storage/activities/...'
    if (path.startsWith("storage/")) {
      // quita posible '/' duplicado
      return `${window.location.origin}/${path.replace(/^\//, "")}`;
    }
    // path relativo 'activities/images/...'
    return `${window.location.origin}/storage/${path.replace(/^\//, "")}`;
  };

  const submitResults = async (activityId, completed = true, score = null) => {
    setLoadingSubmit(true);
    try {
      const payload = {};
      if (current?.type === "quiz") {
        // convertimos answers a array o JSON esperado por backend
        payload.answers = Object.values(answers);
      }
      if (score !== null) payload.score = score;
      payload.completed = completed;

      await api.post(`/student/activities/${activityId}/submit`, payload);

      alert("✅ Respuesta enviada");
      setCurrent(null);
      fetchActivities();
    } catch (err) {
      console.error("Error al enviar respuesta:", err);
      const message = err?.response?.data?.message || "Error al enviar la respuesta";
      alert("❌ " + message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <h4>🧠 Actividades disponibles</h4>

      <div className="list-group mt-3">
        {activities.length === 0 && <div className="alert alert-info">No hay actividades disponibles.</div>}

        {activities.map((act) => (
          <div key={act.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{act.title}</strong>
                <div className="text-muted small">{act.description}</div>

                {/* recursos */}
                <div className="mt-2">
                  {Array.isArray(act.resources) && act.resources.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {act.resources.map((r, idx) => (
                        <div key={idx}>
                          {r.type === "image" ? (
                            <img src={resourceUrl(r)} alt={act.title} className="img-thumbnail" style={{ maxWidth: 500, maxHeight: 300 }} />
                          ) : r.type === "document" ? (
                            <a className="btn btn-sm btn-outline-primary" href={resourceUrl(r)} target="_blank" rel="noopener noreferrer">📄 Ver documento</a>
                          ) : r.type === "link" ? (
                            <a className="btn btn-sm btn-outline-info" href={resourceUrl(r)} target="_blank" rel="noopener noreferrer">🔗 Ir al enlace</a>
                          ) : (
                            <a className="btn btn-sm btn-outline-secondary" href={resourceUrl(r)} target="_blank" rel="noopener noreferrer">Abrir</a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-end">
                {act.results && act.results.length > 0 ? (
                  <div>
                    <span className="badge bg-success mb-1">Calificación: {act.results[0].score ?? "—"}</span>
                    <div className="small text-muted">Status: {act.results[0].completed ? "Completado" : "Pendiente"}</div>
                  </div>
                ) : (
                  <div className="small text-muted mb-1">Sin resolver</div>
                )}

                <div className="mt-2">
                  <button className="btn btn-sm btn-primary" onClick={() => openActivity(act)}>Abrir / Resolver</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Panel lateral / modal simple */}
      {current && (
        <div className="card mt-4 p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-start">
            <h5>{current.title}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrent(null)}>Cerrar</button>
          </div>

          <div className="mt-2">
            <p className="text-muted">{current.description}</p>

            {current.type === "quiz" && current.questions && (
              <div>
                <h6>Cuestionario</h6>
                {current.questions.map((q, i) => (
                  <div key={i} className="mb-3">
                    <div><strong>{i + 1}. {q.q}</strong></div>
                    {q.options.map((op, oi) => (
                      <div className="form-check" key={oi}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`q-${i}`}
                          id={`q-${i}-${oi}`}
                          checked={String(answers[i]) === String(oi)}
                          onChange={() => handleAnswerChange(i, String(oi))}
                        />
                        <label className="form-check-label" htmlFor={`q-${i}-${oi}`}>{op}</label>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="d-flex gap-2">
                  <button className="btn btn-success" disabled={loadingSubmit} onClick={() => submitResults(current.id, true)}>Enviar respuestas</button>
                </div>
              </div>
            )}

            {current.resources?.filter(r => r.type === "image").map((r, idx) => (
              <div key={idx} className="text-center my-3">
                <img
                  src={resourceUrl(r)}
                  alt="Imagen de la actividad"
                  className="img-fluid rounded shadow"
                  style={{ maxWidth: "550px" }}
                />
              </div>
            ))}

            {current.type !== "quiz" && (
              <div>
                <p className="mb-2"><em>Marca la actividad como resuelta cuando hayas revisado el material.</em></p>
                <div className="d-flex gap-2">
                  <button className="btn btn-success" disabled={loadingSubmit} onClick={() => submitResults(current.id, true)}>Marcar como resuelta</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivitiesList;
