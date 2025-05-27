import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './PacienteDashboard.css'; // Importa o CSS

export default function PacienteDashboard() {
  const navigate = useNavigate(); // Obtém a função de navegação

  // Função para deslogar
  const handleLogout = () => {
    console.log('Deslogando...');
    // Remover token e dados do usuário do armazenamento local
    localStorage.removeItem('token'); // Altere 'token' conforme a chave usada no login
    localStorage.removeItem('user'); // Altere 'user' conforme a chave usada no login

    // Redirecionar para a página de login
    navigate('/login');
  };

  return (
    <div className="paciente-dashboard-container">
      <nav className="paciente-dashboard-nav">
        <div className="paciente-dashboard-logo">
          {/* Aqui você pode colocar um ícone ou texto para o logo */}
          FisioHub
        </div>
        <div className="paciente-dashboard-nav-links">
          {/* Link/Botão para ver o perfil */}
          <a href="#" className="paciente-dashboard-nav-link">Ver Perfil</a> {/* Substituir # pela rota correta */}
          {/* Botão para deslogar */}
          <button onClick={handleLogout} className="paciente-dashboard-nav-link">Deslogar</button>
        </div>
      </nav>

      <h1 className="paciente-dashboard-title">Dashboard do Paciente</h1>

      <div className="paciente-dashboard-section">
        <h3>Informações do Perfil</h3>
        <p>Nome: [Nome do Paciente]</p> {/* Substituir com dados reais */}
        <p>Email: [Email do Paciente]</p> {/* Substituir com dados reais */}
        <p>Gênero: [Gênero do Paciente]</p> {/* Substituir com dados reais */}
        {/* Adicionar mais informações do perfil conforme necessário */}
      </div>

      <div className="paciente-dashboard-section">
        <h3>Próxima Consulta</h3>
        <p>Data: [Data da Consulta]</p> {/* Substituir com dados reais */}
        <p>Hora: [Hora da Consulta]</p> {/* Substituir com dados reais */}
        <p>Médico: [Nome do Médico]</p> {/* Substituir com dados reais */}
        {/* Adicionar mais detalhes da consulta */}
        <a href="#" className="paciente-dashboard-link">Ver Detalhes</a> {/* Link fictício */}
      </div>

      <div className="paciente-dashboard-section">
        <h3>Histórico de Consultas</h3>
        <p>Visualize suas consultas anteriores.</p>
        <a href="/paciente/historico" className="paciente-dashboard-link">Ver Histórico</a>
      </div>

      <div className="paciente-dashboard-section">
        <h3>Médicos Disponíveis</h3>
        <p>Encontre médicos e agende novas consultas.</p>
        <a href="/paciente/medicos" className="paciente-dashboard-link">Buscar Médicos</a>
      </div>

      {/* Adicionar outras seções conforme necessário */}
    </div>
  );
}