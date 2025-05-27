import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfigAdm = () => {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/perfil", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setDados(res.data))
      .catch((err) => console.error("Erro ao carregar perfil:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("http://localhost:3001/admin/perfil", dados, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => setMensagem("Dados atualizados com sucesso."))
      .catch(() => setMensagem("Erro ao atualizar dados."));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Configurações do Administrador
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            name="nome"
            value={dados.nome}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={dados.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">Nova Senha</label>
          <input
            type="password"
            name="senha"
            value={dados.senha}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="Deixe em branco para não alterar"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>

        {mensagem && <p className="mt-4 text-green-600">{mensagem}</p>}
      </form>
    </div>
  );
};

export default ConfigAdm;
