import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HistoricoConsultas = () => {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/consultas/historico",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConsultas(response.data);
      } catch (error) {
        console.error("Erro ao buscar histórico de consultas:", error);
      }
    };

    fetchConsultas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Histórico de Consultas
        </h1>

        {consultas.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        ) : (
          <ul className="space-y-4">
            {consultas.map((consulta) => (
              <li
                key={consulta.id}
                className="border border-gray-200 rounded p-4"
              >
                <p>
                  <strong>Médico:</strong> {consulta.nome_medico}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(consulta.data).toLocaleDateString()}
                </p>
                <p>
                  <strong>Horário:</strong> {consulta.horario}
                </p>
                <p>
                  <strong>Status:</strong> {consulta.status}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <Link
            to="/paciente/dashboard"
            className="text-blue-600 hover:underline"
          >
            ← Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HistoricoConsultas;
