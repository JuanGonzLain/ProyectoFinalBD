import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login/Login.jsx'
import DashboardEstudiante from './Dashboards/estudiante/inicioEstudiante.jsx'
import DashboardDocente from './Dashboards/docente/inicioDocente.jsx'
import DashboardCoordinador from './Dashboards/coordinador/inicioCoordinador.jsx'

export default function App() { //funcion que define la estructura de rutas y navegación global de la aplicación, estableciendo las rutas para el login y los dashboards de cada tipo de usuario (estudiante, docente, coordinador) y redirigiendo a la ruta de login por defecto.
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboards/estudiante" element={<DashboardEstudiante />} />
      <Route path="/dashboards/docente" element={<DashboardDocente />} />
      <Route path="/dashboards/coordinador" element={<DashboardCoordinador />} />
    </Routes>
  )
}