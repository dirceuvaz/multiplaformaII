import React, { useEffect, useState } from "react";

const ConfigMedico = () => {
  const [medico, setMedico] = useState({
    nome: "",
    email: "",
    especialidade: "",
  });

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/medico/perfil", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMedico(data))
      .catch((err) => console.error("Erro ao buscar dados do médico:", err));
  }, []);

  const handleChange = (e) => {
    setMedico({ ...medico, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/medico/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(medico),
    })
      .then((res) => res.json())
      .then((data) => {
        setMensagem("Dados atualizados com sucesso.");
      })
      .catch((err) => {
        setMensagem("Erro ao atualizar dados.");
        console.error("Erro:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">
        Configurações da Conta
      </h2>

      {mensagem && (
        <div className="mb-4 text-green-600 font-medium">{mensagem}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-xl"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={medico.nome}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={medico.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Especialidade</label>
          <input
            type="text"
            name="especialidade"
            value={medico.especialidade}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default ConfigMedico;
