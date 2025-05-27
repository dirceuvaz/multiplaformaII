import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardAdm = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">
          Painel do Administrador
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/adm/usuarios")}
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Gerenciar Usuários
          </h2>
          <p className="text-gray-600">
            Visualizar, editar ou excluir usuários.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/adm/consultas")}
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Consultas
          </h2>
          <p className="text-gray-600">
            Visualizar todas as consultas do sistema.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/adm/relatorios")}
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Relatórios Gerais
          </h2>
          <p className="text-gray-600">
            Acesso aos dados estatísticos e relatórios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdm;
