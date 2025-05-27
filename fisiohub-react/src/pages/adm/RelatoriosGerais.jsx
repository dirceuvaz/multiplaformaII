import React, { useEffect, useState } from "react";
import axios from "axios";

const RelatoriosGerais = () => {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalConsultas, setTotalConsultas] = useState(0);
  const [consultasPorStatus, setConsultasPorStatus] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/relatorios")
      .then((res) => {
        const { totalUsuarios, totalConsultas, consultasPorStatus } = res.data;
        setTotalUsuarios(totalUsuarios);
        setTotalConsultas(totalConsultas);
        setConsultasPorStatus(consultasPorStatus);
      })
      .catch((err) => console.error("Erro ao buscar relatórios:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Relatórios Gerais
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Total de Usuários</h2>
          <p className="text-3xl mt-2 text-blue-600">{totalUsuarios}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold">Total de Consultas</h2>
          <p className="text-3xl mt-2 text-blue-600">{totalConsultas}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Consultas por Status</h2>
          <ul>
            {Object.entries(consultasPorStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between">
                <span>{status}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosGerais;
