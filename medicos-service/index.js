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

// Listar médicos
app.get('/medicos', async (req, res) => {
  try {
    // Buscar o ID do perfil Médico
    const [perfilRows] = await pool.query("SELECT ID_USUARIO_PERFIL FROM D_USUARIO_PERFIL WHERE USUARIO_PERFIL_TIPO = 'Médico'");
    if (!perfilRows.length) return res.status(500).json({ error: 'Perfil Médico não encontrado' });
    const perfilId = perfilRows[0].ID_USUARIO_PERFIL;
    // Buscar médicos (join com D_MEDICO)
    const [rows] = await pool.query(`
      SELECT u.*, m.MEDICO_CRM, m.MEDICO_ESPECIALIDADE
      FROM F_USUARIO u
      JOIN D_MEDICO m ON u.ID_USUARIO = m.F_USUARIO_ID
      WHERE u.F_USUARIO_ID_USUARIO_PERFIL = ?
    `, [perfilId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar médicos', details: err.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Medicos Service rodando na porta ${PORT}`);
}); 