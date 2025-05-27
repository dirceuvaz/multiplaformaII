import React, { useEffect, useState } from "react";
import "./HistoricoConsultas.css";

const HistoricoConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const pacienteId = localStorage.getItem("pacienteId");

  useEffect(() => {
    fetch(`http://localhost:3001/api/consultas/paciente/${pacienteId}`)
      .then((res) => res.json())
      .then((data) => setConsultas(data))
      .catch((err) => console.error("Erro ao carregar consultas:", err));
  }, [pacienteId]);

  return (
    <div className="historico-container">
      <h2>Histórico de Consultas</h2>
      <div className="tabela-consultas">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Médico</th>
              <th>Especialidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((consulta) => (
              <tr key={consulta.id}>
                <td>{new Date(consulta.data).toLocaleDateString()}</td>
                <td>{consulta.medico_nome}</td>
                <td>{consulta.especialidade}</td>
                <td>{consulta.status}</td>
              </tr>
            ))}
            {consultas.length === 0 && (
              <tr>
                <td colSpan="4">Nenhuma consulta encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoConsultas;
