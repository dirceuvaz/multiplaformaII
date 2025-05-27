import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicoDashboard.css'; // Importa o CSS

export default function MedicoDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Deslogando Médico...');
    // TODO: Remover token e dados do usuário do armazenamento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="medico-dashboard-container">
      <nav className="medico-dashboard-nav">
        <div className="medico-dashboard-logo">
          {/* Logo/Ícone Médico */}
          Médico FisioHub
        </div>
        <div className="medico-dashboard-nav-links">
          {/* Links de navegação do Médico */}
          <a href="#" className="medico-dashboard-nav-link">Meus Pacientes</a> {/* Substituir # pela rota correta */}
          <a href="#" className="medico-dashboard-nav-link">Minhas Consultas</a> {/* Substituir # pela rota correta */}
          <a href="#" className="medico-dashboard-nav-link">Disponibilidade</a> {/* Substituir # pela rota correta */}
          {/* Botão para deslogar */}
          <button onClick={handleLogout} className="medico-dashboard-nav-link">Deslogar</button>
        </div>
      </nav>

      <h1 className="medico-dashboard-title">Dashboard do Médico</h1>

      <div className="medico-dashboard-section">
        <h3>Agenda do Dia</h3>
        <p>Visualize suas consultas agendadas para hoje.</p>
        {/* Adicionar lista de consultas do dia */}
      </div>

      <div className="medico-dashboard-section">
        <h3>Pacientes Recentes</h3>
        <p>Lista de pacientes que você atendeu recentemente.</p>
        {/* Adicionar lista de pacientes recentes */}
        <a href="#" className="medico-dashboard-link">Ver Todos os Pacientes</a> {/* Link para página de gerenciamento de pacientes */}
      </div>

      {/* Adicionar outras seções relevantes para o médico */}
    </div>
  );
} 