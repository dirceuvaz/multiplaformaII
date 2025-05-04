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
    const [rows] = await pool.query(`
      SELECT q.*, u.USUARIO_NOME 
      FROM D_QUESTIONARIO q
      LEFT JOIN F_USUARIO u ON q.F_USUARIO_ID = u.ID_USUARIO
    `);
    res.json(rows.map(row => ({
      ...row,
      USUARIO_NOME: row.USUARIO_NOME || 'Nenhum usuário associado'
    })));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar questionários', details: err.message });
  }
});

// Função utilitária para validar existência do usuário
async function usuarioExiste(id) {
  const [rows] = await pool.query('SELECT ID_USUARIO FROM F_USUARIO WHERE ID_USUARIO = ?', [id]);
  return rows.length > 0;
}

// Criar questionário
app.post('/questionarios', async (req, res) => {
  const { titulo, desc, pergunta, nota, resposta, usuarioId } = req.body;
  if (!titulo || !usuarioId) return res.status(400).json({ error: 'Dados obrigatórios' });
  try {
    if (!(await usuarioExiste(usuarioId))) return res.status(400).json({ error: 'Usuário não existe' });
    const [result] = await pool.query(
      'INSERT INTO D_QUESTIONARIO (QUESTIONARIO_TITULO, QUESTIONARIO_DESC, QUESTIONARIO_PERGUNTA, QUESTIONARIO_NOTA, QUESTIONARIO_RESPOSTA, QUESTIONARIO_DATA_CRIACAO, F_USUARIO_ID) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
      [titulo, desc || null, pergunta || null, nota || null, resposta || null, usuarioId]
    );
    const [rows] = await pool.query(`
      SELECT q.*, u.USUARIO_NOME 
      FROM D_QUESTIONARIO q
      LEFT JOIN F_USUARIO u ON q.F_USUARIO_ID = u.ID_USUARIO
      WHERE q.ID_QUESTIONARIO = ?
    `, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar questionário', details: err.message });
  }
});

// Buscar questionário por ID
app.get('/questionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT q.*, u.USUARIO_NOME 
      FROM D_QUESTIONARIO q
      LEFT JOIN F_USUARIO u ON q.F_USUARIO_ID = u.ID_USUARIO
      WHERE q.ID_QUESTIONARIO = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Questionário não encontrado' });
    res.json({
      ...rows[0],
      USUARIO_NOME: rows[0].USUARIO_NOME || 'Nenhum usuário associado'
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar questionário', details: err.message });
  }
});

// Atualizar questionário
app.put('/questionarios/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, desc, pergunta, nota, resposta, usuarioId } = req.body;
  if (!titulo && !desc && !pergunta && !nota && !resposta && !usuarioId) return res.status(400).json({ error: 'Nenhum dado para atualizar' });
  let fields = [];
  let values = [];
  if (titulo) { fields.push('QUESTIONARIO_TITULO = ?'); values.push(titulo); }
  if (desc) { fields.push('QUESTIONARIO_DESC = ?'); values.push(desc); }
  if (pergunta) { fields.push('QUESTIONARIO_PERGUNTA = ?'); values.push(pergunta); }
  if (nota) { fields.push('QUESTIONARIO_NOTA = ?'); values.push(nota); }
  if (resposta) { fields.push('QUESTIONARIO_RESPOSTA = ?'); values.push(resposta); }
  if (usuarioId) {
    if (!(await usuarioExiste(usuarioId))) return res.status(400).json({ error: 'Usuário não existe' });
    fields.push('F_USUARIO_ID = ?'); values.push(usuarioId);
  }
  values.push(id);
  try {
    const [result] = await pool.query(`UPDATE D_QUESTIONARIO SET ${fields.join(', ')} WHERE ID_QUESTIONARIO = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Questionário não encontrado' });
    const [rows] = await pool.query(`
      SELECT q.*, u.USUARIO_NOME 
      FROM D_QUESTIONARIO q
      LEFT JOIN F_USUARIO u ON q.F_USUARIO_ID = u.ID_USUARIO
      WHERE q.ID_QUESTIONARIO = ?
    `, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar questionário', details: err.message });
  }
});

// Deletar questionário
app.delete('/questionarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM D_QUESTIONARIO WHERE ID_QUESTIONARIO = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Questionário não encontrado' });
    res.json({ status: 'Questionário deletado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar questionário', details: err.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Questionarios Service rodando na porta ${PORT}`);
});