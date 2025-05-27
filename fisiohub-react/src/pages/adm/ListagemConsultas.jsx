import React, { useEffect, useState } from "react";
import axios from "axios";

const ListagemConsultas = () => {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/consultas") // Endpoint do backend
      .then((res) => setConsultas(res.data))
      .catch((err) => console.error("Erro ao carregar consultas:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Listagem de Consultas
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Paciente</th>
              <th className="px-4 py-2 text-left">Médico</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2 text-left">Hora</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((consulta) => (
              <tr key={consulta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{consulta.id}</td>
                <td className="px-4 py-2">{consulta.nome_paciente}</td>
                <td className="px-4 py-2">{consulta.nome_medico}</td>
                <td className="px-4 py-2">{consulta.data}</td>
                <td className="px-4 py-2">{consulta.hora}</td>
                <td className="px-4 py-2">{consulta.status}</td>
              </tr>
            ))}
            {consultas.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Nenhuma consulta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListagemConsultas;
