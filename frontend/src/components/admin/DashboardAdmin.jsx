// src/components/admin/DashboardAdmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadMaterials from "./UploadMaterials";
import CreateActivities from "./CreateActivities";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../services/api";

function DashboardAdmin() {
  const [activeView, setActiveView] = useState("materials");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!token || !storedUser) return navigate("/login");
    if (storedUser.role !== "admin") return navigate("/student");

    setUser(storedUser);

    const validateSession = async () => {
      try {
        await api.get("/user");
      } catch {
        localStorage.clear();
        navigate("/login");
      }
    };
    validateSession();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderView = () => {
    switch (activeView) {
      case "materials": return <UploadMaterials />;
      case "activities": return <CreateActivities />;
      default: return <UploadMaterials />;
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center text-primary mb-4">
          Bienvenid@, {user?.name || "Administrador"} 🧑‍💼
        </h2>

        <ul className="nav nav-pills justify-content-center mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeView === "materials" ? "active" : ""}`}
              onClick={() => setActiveView("materials")}
            >
              Subir Materiales
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeView === "activities" ? "active" : ""}`}
              onClick={() => setActiveView("activities")}
            >
              Crear Actividades
            </button>
          </li>
        </ul>

        <div className="p-3">{renderView()}</div>

        <div className="text-center mt-3">
          <button className="btn btn-danger fw-semibold" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
