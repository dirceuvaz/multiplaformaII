require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Configuração de conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Verificando se o micro serviço Auth está online
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Cadastro de usuário
app.post('/auth/register', async (req, res) => {
  const { nome, email, senha, perfil } = req.body;
  if (!nome || !email || !senha || !perfil) return res.status(400).json({ error: 'Dados obrigatórios não inseridos' });
  const hash = await bcrypt.hash(senha, 10);
  try {
    const [result] = await pool.query(
      'INSERT INTO F_USUARIO (USUARIO_NOME, USUARIO_EMAIL, USUARIO_SENHA, USUARIO_DATA_CRIACAO, F_USUARIO_ID_USUARIO_PERFIL) VALUES (?, ?, ?, NOW(), ?)',
      [nome, email, hash, perfil]
    );
    // Buscando o usuário recém-criado
    const [rows] = await pool.query('SELECT * FROM F_USUARIO WHERE ID_USUARIO = ?', [result.insertId]);
    const usuario = rows[0];
    const token = jwt.sign({ id: usuario.ID_USUARIO, perfil: usuario.F_USUARIO_ID_USUARIO_PERFIL }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ id: result.insertId, token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário', details: err.message });
  }
});

// Login de usuário
app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Dados obrigatórios não inseridos' });
  try {
    const [rows] = await pool.query('SELECT * FROM F_USUARIO WHERE USUARIO_EMAIL = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Usuário não encontrado' });
    const usuario = rows[0];
    const match = await bcrypt.compare(senha, usuario.USUARIO_SENHA);
    if (!match) return res.status(401).json({ error: 'Senha inválida' });
    const token = jwt.sign({ id: usuario.ID_USUARIO, perfil: usuario.F_USUARIO_ID_USUARIO_PERFIL }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login', details: err.message });
  }
});

// Listar todos os usuários
app.get('/auth/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM F_USUARIO');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: err.message });
  }
});

// Listar usuário por ID
app.get('/auth/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM F_USUARIO WHERE ID_USUARIO = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário', details: err.message });
  }
});

// Atualizar usuário
app.put('/auth/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, perfil } = req.body;
  if (!nome && !email && !senha && !perfil) return res.status(400).json({ error: 'Nenhum dado para atualizar' });
  let fields = [];
  let values = [];
  if (nome) { fields.push('USUARIO_NOME = ?'); values.push(nome); }
  if (email) { fields.push('USUARIO_EMAIL = ?'); values.push(email); }
  if (senha) { const hash = await bcrypt.hash(senha, 10); fields.push('USUARIO_SENHA = ?'); values.push(hash); }
  if (perfil) { fields.push('F_USUARIO_ID_USUARIO_PERFIL = ?'); values.push(perfil); }
  values.push(id);
  try {
    const [result] = await pool.query(`UPDATE F_USUARIO SET ${fields.join(', ')} WHERE ID_USUARIO = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ status: 'Usuário atualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário', details: err.message });
  }
});

// Deletar usuário
app.delete('/auth/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM F_USUARIO WHERE ID_USUARIO = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ status: 'Usuário deletado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário', details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Micro Serviço de Autenticação -> Auth Service - rodando na porta ${PORT}`);
}); 