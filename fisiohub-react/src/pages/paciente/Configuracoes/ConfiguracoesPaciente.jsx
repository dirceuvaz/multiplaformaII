import React, { useState, useEffect } from "react";
import "./ConfiguracoesPaciente.css";

const ConfiguracoesPaciente = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    const carregarPerfil = async () => {
      const response = await fetch(
        "http://localhost:3001/api/paciente/perfil/1"
      ); // Substituir "1" pelo ID dinâmico via auth
      const data = await response.json();
      setFormData(data);
    };

    carregarPerfil();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:3001/api/paciente/perfil/1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      alert("Perfil atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar perfil.");
    }
  };

  return (
    <div className="config-container">
      <h2>Configurações da Conta</h2>
      <form onSubmit={handleSubmit} className="config-form">
        <label>Nome</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Telefone</label>
        <input
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
        />

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default ConfiguracoesPaciente;
