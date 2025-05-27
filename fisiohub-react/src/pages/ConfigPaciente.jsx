import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ConfigPaciente = () => {
  const [perfil, setPerfil] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    // Buscar dados do paciente no backend
    const fetchPerfil = async () => {
      try {
        const response = await fetch("http://localhost:3001/paciente/perfil");
        const data = await response.json();
        setPerfil(data);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/paciente/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfil),
      });
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 shadow">
        <h1 className="text-2xl font-semibold">Configurações do Paciente</h1>
        <Link to="/paciente-dashboard" className="text-sm underline">
          Voltar à Dashboard
        </Link>
      </header>

      <main className="p-6 max-w-xl mx-auto">
        <form onSubmit={handleSalvar} className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            Atualizar Perfil
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              value={perfil.nome}
              onChange={handleChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={perfil.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              value={perfil.telefone}
              onChange={handleChange}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </form>
      </main>
    </div>
  );
};

export default ConfigPaciente;
