require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Listar reabilitações
app.get('/reabilitacao', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, u.USUARIO_NOME 
      FROM D_REABILITACAO r
      LEFT JOIN F_USUARIO u ON u.ID_REABILITACAO = r.ID_REABILITACAO
    `);

    // Ajustar a resposta para evitar valores nulos
    const response = rows.map(row => ({
      ...row,
      USUARIO_NOME: row.USUARIO_NOME || 'Nenhum usuário associado'
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar reabilitações', details: err.message });
  }
});

// Função utilitária para validar existência do usuário
async function usuarioExiste(id) {
  const [rows] = await pool.query('SELECT ID_USUARIO FROM F_USUARIO WHERE ID_USUARIO = ?', [id]);
  return rows.length > 0;
}

// Criar reabilitação
app.post('/reabilitacao', async (req, res) => {
  const { nome, desc, momento, desc_momento, ordem, usuarioId } = req.body;
  if (!nome || !usuarioId) return res.status(400).json({ error: 'Dados obrigatórios' });
  try {
    if (!(await usuarioExiste(usuarioId))) return res.status(400).json({ error: 'Usuário não existe' });

    // Criar reabilitação
    const [result] = await pool.query(
      'INSERT INTO D_REABILITACAO (REABILITACAO_NOME, REABILITACAO_DESC, REABILITACAO_MOMENTO, REABILITACAO_DESC_MOMENTO, REABILITACAO_ORDEM, REABILITACAO_DATA_CRIACAO) VALUES (?, ?, ?, ?, ?, NOW())',
      [nome, desc || null, momento || null, desc_momento || null, ordem || null]
    );

    // Atualizar o usuário para associar à nova reabilitação
    await pool.query('UPDATE F_USUARIO SET ID_REABILITACAO = ? WHERE ID_USUARIO = ?', [result.insertId, usuarioId]);

    const [rows] = await pool.query('SELECT * FROM D_REABILITACAO WHERE ID_REABILITACAO = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar reabilitação', details: err.message });
  }
});

// Buscar reabilitação por ID
app.get('/reabilitacao/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT r.*, u.USUARIO_NOME 
      FROM D_REABILITACAO r
      LEFT JOIN F_USUARIO u ON u.ID_REABILITACAO = r.ID_REABILITACAO
      WHERE r.ID_REABILITACAO = ?
    `, [id]);

    if (!rows.length) return res.status(404).json({ error: 'Reabilitação não encontrada' });

    // Ajustar a resposta para evitar valores nulos
    const response = {
      ...rows[0],
      USUARIO_NOME: rows[0].USUARIO_NOME || 'Nenhum usuário associado'
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar reabilitação', details: err.message });
  }
});

// Atualizar reabilitação
app.put('/reabilitacao/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, desc, momento, desc_momento, ordem, usuarioId } = req.body;
  if (!nome && !desc && !momento && !desc_momento && !ordem && !usuarioId) {
    return res.status(400).json({ error: 'Nenhum dado para atualizar' });
  }

  let fields = [];
  let values = [];

  if (nome) { fields.push('REABILITACAO_NOME = ?'); values.push(nome); }
  if (desc) { fields.push('REABILITACAO_DESC = ?'); values.push(desc); }
  if (momento) { fields.push('REABILITACAO_MOMENTO = ?'); values.push(momento); }
  if (desc_momento) { fields.push('REABILITACAO_DESC_MOMENTO = ?'); values.push(desc_momento); }
  if (ordem) { fields.push('REABILITACAO_ORDEM = ?'); values.push(ordem); }

  values.push(id);

  try {
    // Atualizar reabilitação
    const [result] = await pool.query(`UPDATE D_REABILITACAO SET ${fields.join(', ')} WHERE ID_REABILITACAO = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reabilitação não encontrada' });

    // Atualizar associação do usuário, se necessário
    if (usuarioId) {
      if (!(await usuarioExiste(usuarioId))) return res.status(400).json({ error: 'Usuário não existe' });
      await pool.query('UPDATE F_USUARIO SET ID_REABILITACAO = ? WHERE ID_USUARIO = ?', [id, usuarioId]);
    }

    const [rows] = await pool.query('SELECT * FROM D_REABILITACAO WHERE ID_REABILITACAO = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar reabilitação', details: err.message });
  }
});

// Deletar reabilitação
app.delete('/reabilitacao/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Remover associação dos usuários antes de deletar a reabilitação
    await pool.query('UPDATE F_USUARIO SET ID_REABILITACAO = NULL WHERE ID_REABILITACAO = ?', [id]);

    // Deletar reabilitação
    const [result] = await pool.query('DELETE FROM D_REABILITACAO WHERE ID_REABILITACAO = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Reabilitação não encontrada' });

    res.json({ status: 'Reabilitação deletada' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar reabilitação', details: err.message });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Reabilitacao Service rodando na porta ${PORT}`);
});