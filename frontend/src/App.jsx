// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/Login";
import Register from "./components/Register";
import DashboardAdmin from "./components/admin/DashboardAdmin";
import DashboardStudent from "./components/students/DashboardStudent";
import ProtectedRoute from "./components/ProtectedRoute";

// (Opcional) vistas internas si las vas a usar directamente
import MaterialsList from "./components/students/MaterialsList";
import ActivitiesList from "./components/students/ActivitiesList";
function App() {
  return (
    <Router>
      <Routes>
        {/* Página de inicio -> redirige automáticamente al login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardStudent />
            </ProtectedRoute>
          }
        />

        {/* (Opcional) vistas internas si las manejas por separado */}
        <Route
          path="/student/materials"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MaterialsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/activities"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ActivitiesList />
            </ProtectedRoute>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<h2 className="text-center mt-5">Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
