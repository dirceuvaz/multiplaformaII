import React from "react";
import { Link } from "react-router-dom";

const MedicoDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 shadow">
        <h1 className="text-2xl font-semibold">Dashboard do Médico</h1>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/medico/consultas"
            className="block bg-white shadow rounded-lg p-6 hover:shadow-md hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-700">
              Consultas Agendadas
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Veja a lista de consultas marcadas com os pacientes.
            </p>
          </Link>

          <Link
            to="/medico/prontuarios"
            className="block bg-white shadow rounded-lg p-6 hover:shadow-md hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-700">Prontuários</h2>
            <p className="text-sm text-gray-600 mt-2">
              Acesse e preencha os prontuários dos pacientes.
            </p>
          </Link>

          <Link
            to="/medico/configuracoes"
            className="block bg-white shadow rounded-lg p-6 hover:shadow-md hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-700">
              Configurações
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Atualize seus dados pessoais e configurações.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MedicoDashboard;
