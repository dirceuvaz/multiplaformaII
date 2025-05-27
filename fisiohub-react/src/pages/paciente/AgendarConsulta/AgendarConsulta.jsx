import React, { useState, useEffect } from "react";
import "./AgendarConsulta.css";

const AgendarConsulta = () => {
  const [medicos, setMedicos] = useState([]);
  const [formData, setFormData] = useState({
    medicoId: "",
    data: "",
    hora: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/medicos")
      .then((res) => res.json())
      .then((data) => setMedicos(data))
      .catch((err) => console.error("Erro ao carregar médicos:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/api/consultas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Consulta agendada com sucesso!");
      setFormData({ medicoId: "", data: "", hora: "" });
    } else {
      alert("Erro ao agendar consulta.");
    }
  };

  return (
    <div className="agendar-container">
      <h2>Agendar Consulta</h2>
      <form onSubmit={handleSubmit} className="agendar-form">
        <label>Médico</label>
        <select
          name="medicoId"
          value={formData.medicoId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um médico</option>
          {medicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.nome} - {medico.especialidade}
            </option>
          ))}
        </select>

        <label>Data</label>
        <input
          type="date"
          name="data"
          value={formData.data}
          onChange={handleChange}
          required
        />

        <label>Hora</label>
        <input
          type="time"
          name="hora"
          value={formData.hora}
          onChange={handleChange}
          required
        />

        <button type="submit">Agendar</button>
      </form>
    </div>
  );
};

export default AgendarConsulta;
