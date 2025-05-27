import React, { useEffect, useState } from "react";

const ConsultasMedico = () => {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    // Dirceu: Substituir a URL pelo endpoint real do backend
    fetch("http://localhost:3001/consultas/medico", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setConsultas(data))
      .catch((err) => console.error("Erro ao buscar consultas:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Consultas Agendadas
      </h1>

      {consultas.length === 0 ? (
        <p className="text-gray-600">Nenhuma consulta agendada.</p>
      ) : (
        <ul className="space-y-4">
          {consultas.map((consulta) => (
            <li
              key={consulta.id}
              className="bg-white p-4 rounded shadow border border-gray-200"
            >
              <p className="text-lg font-semibold text-gray-800">
                Paciente: {consulta.nomePaciente}
              </p>
              <p className="text-sm text-gray-600">
                Data: {new Date(consulta.data).toLocaleDateString()} às{" "}
                {consulta.horario}
              </p>
              <p className="text-sm text-gray-600">Motivo: {consulta.motivo}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConsultasMedico;
