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
    const [rows] = await pool.query(`
      SELECT 
        ID_USUARIO AS id,
        USUARIO_NOME AS nome,
        USUARIO_EMAIL AS email,
        USUARIO_CPF AS cpf,
        USUARIO_GENERO AS genero
      FROM F_USUARIO
      WHERE F_USUARIO_ID_USUARIO_PERFIL = (
        SELECT ID_USUARIO_PERFIL 
        FROM D_USUARIO_PERFIL 
        WHERE USUARIO_PERFIL_TIPO = 'Medico'
      )
    `);

    if (!rows.length) {
      return res.status(404).json({ error: 'Nenhum médico encontrado.' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar médicos:', err);
    res.status(500).json({ error: 'Erro ao buscar médicos', details: err.message });
  }
});

// Cadastrar médico
app.post('/medicos', async (req, res) => {
  const { nome, email, senha, crm, especialidade } = req.body;
  if (!nome || !email || !senha || !crm || !especialidade) return res.status(400).json({ error: 'Dados obrigatórios' });
  try {
    // Buscar o ID do perfil Médico
    const [perfilRows] = await pool.query("SELECT ID_USUARIO_PERFIL FROM D_USUARIO_PERFIL WHERE USUARIO_PERFIL_TIPO = 'Medico'");
    if (!perfilRows.length) return res.status(500).json({ error: 'Perfil Médico não encontrado' });
    const perfilId = perfilRows[0].ID_USUARIO_PERFIL;
    // Criptografar senha
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(senha, 10);
    // Inserir usuário
    const [userResult] = await pool.query(
      'INSERT INTO F_USUARIO (USUARIO_NOME, USUARIO_EMAIL, USUARIO_SENHA, USUARIO_DATA_CRIACAO, F_USUARIO_ID_USUARIO_PERFIL) VALUES (?, ?, ?, NOW(), ?)',
      [nome, email, hash, perfilId]
    );
    // Inserir dados médicos
    await pool.query(
      'INSERT INTO D_MEDICO (MEDICO_CRM, MEDICO_ESPECIALIDADE, F_USUARIO_ID) VALUES (?, ?, ?)',
      [crm, especialidade, userResult.insertId]
    );
    res.status(201).json({ id: userResult.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar médico', details: err.message });
  }
});

// Buscar médico por ID
app.get('/medicos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT u.*, m.MEDICO_CRM, m.MEDICO_ESPECIALIDADE
      FROM F_USUARIO u
      JOIN D_MEDICO m ON u.ID_USUARIO = m.F_USUARIO_ID
      WHERE u.ID_USUARIO = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Médico não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar médico', details: err.message });
  }
});

// Atualizar médico
app.put('/medicos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, cpf, genero } = req.body;

  if (!nome && !email && !senha && !cpf && !genero) {
    return res.status(400).json({ error: 'Nenhum dado para atualizar.' });
  }

  try {
    const updates = [];
    const values = [];

    if (nome) {
      updates.push('USUARIO_NOME = ?');
      values.push(nome);
    }
    if (email) {
      updates.push('USUARIO_EMAIL = ?');
      values.push(email);
    }
    if (senha) {
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(senha, 10);
      updates.push('USUARIO_SENHA = ?');
      values.push(hash);
    }
    if (cpf) {
      updates.push('USUARIO_CPF = ?');
      values.push(cpf);
    }
    if (genero) {
      updates.push('USUARIO_GENERO = ?');
      values.push(genero);
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE F_USUARIO 
       SET ${updates.join(', ')} 
       WHERE ID_USUARIO = ? 
       AND F_USUARIO_ID_USUARIO_PERFIL = (
         SELECT ID_USUARIO_PERFIL 
         FROM D_USUARIO_PERFIL 
         WHERE USUARIO_PERFIL_TIPO = 'Medico'
       )`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Médico não encontrado ou não possui o perfil de médico.' });
    }

    res.json({ status: 'Médico atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar médico:', err);
    res.status(500).json({ error: 'Erro ao atualizar médico', details: err.message });
  }
});

 // Deletar médico
app.delete('/medicos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Remover o usuário apenas se ele tiver o perfil de médico
    const [result] = await pool.query(
      `DELETE FROM F_USUARIO 
       WHERE ID_USUARIO = ? 
       AND F_USUARIO_ID_USUARIO_PERFIL = (
         SELECT ID_USUARIO_PERFIL 
         FROM D_USUARIO_PERFIL 
         WHERE USUARIO_PERFIL_TIPO = 'Medico'
       )`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Médico não encontrado ou não possui o perfil de médico.' });
    }

    res.json({ status: 'Médico deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar médico:', err);
    res.status(500).json({ error: 'Erro ao deletar médico', details: err.message });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Medicos Service rodando na porta ${PORT}`);
}); 