import React from "react";
import { useNavigate } from "react-router-dom";
import "./PacienteDashboard.css";

function PacienteDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-paciente">
      <header className="dashboard-header">
        <h1>FisioHub</h1>
        <button onClick={() => navigate("/login")}>Sair</button>
      </header>

      <main className="dashboard-main">
        <h2>Bem-vindo(a) ao seu painel</h2>
        <div className="dashboard-cards">
          <div className="card" onClick={() => navigate("/historico")}>
            <h3>Histórico de Consultas</h3>
            <p>Veja todas as suas consultas passadas.</p>
          </div>
          <div
            className="card"
            onClick={() => navigate("/medicos-disponiveis")}
          >
            <h3>Médicos Disponíveis</h3>
            <p>Confira a lista de profissionais disponíveis.</p>
          </div>
          <div className="card" onClick={() => navigate("/agendar")}>
            <h3>Agendar Consulta</h3>
            <p>Escolha um médico e agende uma nova consulta.</p>
          </div>
          <div className="card" onClick={() => navigate("/config-paciente")}>
            <h3>Configurações</h3>
            <p>Atualize suas informações pessoais.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PacienteDashboard;
