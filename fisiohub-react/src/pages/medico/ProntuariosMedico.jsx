import React, { useEffect, useState } from "react";

const ProntuariosMedico = () => {
  const [prontuarios, setProntuarios] = useState([]);

  useEffect(() => {
    // Dirceu: Substitua pela rota correta do backend
    fetch("http://localhost:3001/prontuarios", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProntuarios(data))
      .catch((err) => console.error("Erro ao buscar prontuários:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Prontuários dos Pacientes
      </h1>

      {prontuarios.length === 0 ? (
        <p className="text-gray-600">Nenhum prontuário disponível.</p>
      ) : (
        <ul className="space-y-4">
          {prontuarios.map((item) => (
            <li
              key={item.id}
              className="bg-white p-4 rounded shadow border border-gray-200"
            >
              <p className="font-bold text-gray-800">
                Paciente: {item.nomePaciente}
              </p>
              <p className="text-sm text-gray-600">
                Diagnóstico: {item.diagnostico}
              </p>
              <p className="text-sm text-gray-600">
                Observações: {item.observacoes}
              </p>
              <p className="text-sm text-gray-500">
                Atualizado em: {new Date(item.atualizado_em).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProntuariosMedico;
