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

// Listar questionários
app.get('/questionarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM D_QUESTIONARIO');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar questionários', details: err.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Questionarios Service rodando na porta ${PORT}`);
}); 