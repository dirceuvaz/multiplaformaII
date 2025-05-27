import React, { useEffect, useState } from "react";
import "./MedicosDisponiveis.css";

const MedicosDisponiveis = () => {
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/medicos")
      .then((res) => res.json())
      .then((data) => setMedicos(data))
      .catch((err) => console.error("Erro ao buscar médicos:", err));
  }, []);

  return (
    <div className="medicos-container">
      <h2>Médicos Disponíveis</h2>
      <div className="lista-medicos">
        {medicos.length > 0 ? (
          medicos.map((medico) => (
            <div className="card-medico" key={medico.id}>
              <h3>{medico.nome}</h3>
              <p>
                <strong>Especialidade:</strong> {medico.especialidade}
              </p>
              <p>
                <strong>Email:</strong> {medico.email}
              </p>
            </div>
          ))
        ) : (
          <p>Nenhum médico disponível no momento.</p>
        )}
      </div>
    </div>
  );
};

export default MedicosDisponiveis;
