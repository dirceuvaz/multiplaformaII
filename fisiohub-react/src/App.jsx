import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Homes from './pages/Homes'
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'
import PacienteDashboard from './pages/PacienteDashboard'
import HistoricoConsultas from './pages/HistoricoConsultas'
import MedicosDisponiveis from './pages/MedicosDisponiveis'
import AdminDashboard from './pages/AdminDashboard'
import MedicoDashboard from './pages/MedicoDashboard'
import GerenciarUsuarios from './pages/adm/GerenciarUsuarios'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/paciente/dashboard" element={<PacienteDashboard />} />
      <Route path="/paciente/historico" element={<HistoricoConsultas />} />
      <Route path="/paciente/medicos" element={<MedicosDisponiveis />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/medico/dashboard" element={<MedicoDashboard />} />
      <Route path="/admin/usuarios" element={<GerenciarUsuarios />} />
    </Routes>
  )
}

export default App