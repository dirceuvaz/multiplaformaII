require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Listar pacientes
app.get('/pacientes', async (req, res) => {
  try {
    // Buscar o ID do perfil Paciente
    const [perfilRows] = await pool.query("SELECT ID_USUARIO_PERFIL FROM D_USUARIO_PERFIL WHERE USUARIO_PERFIL_TIPO = 'Paciente'");
    if (!perfilRows.length) return res.status(500).json({ error: 'Perfil Paciente não encontrado' });
    const perfilId = perfilRows[0].ID_USUARIO_PERFIL;
    // Buscar pacientes
    const [rows] = await pool.query('SELECT * FROM F_USUARIO WHERE F_USUARIO_ID_USUARIO_PERFIL = ?', [perfilId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pacientes', details: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Pacientes Service rodando na porta ${PORT}`);
}); 