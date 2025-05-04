require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Configurar transporte de e-mail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Função para enviar e-mail
async function enviarEmail(remetente, destinatario, titulo, mensagem) {
  await transporter.sendMail({
    from: remetente,
    to: destinatario,
    subject: titulo,
    text: mensagem
  });
}

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Função utilitária para validar existência do usuário
async function usuarioExiste(id) {
  if (!id) return true; // Notificação pode ser geral
  const [rows] = await pool.query('SELECT ID_USUARIO FROM F_USUARIO WHERE ID_USUARIO = ?', [id]);
  return rows.length > 0;
}

// Criar notificação
app.post('/notificacoes', async (req, res) => {
  const { titulo, assunto, mensagem, remetente, destinatario, usuarioId, status } = req.body;
  if (!titulo || !mensagem || !remetente || !destinatario) return res.status(400).json({ error: 'Dados obrigatórios' });
  try {
    if (!(await usuarioExiste(usuarioId))) return res.status(400).json({ error: 'Usuário não existe' });

    const [result] = await pool.query(
      'INSERT INTO D_NOTIFICACAO (NOTIFICACAO_TITULO, NOTIFICACAO_ASSUNTO, NOTIFICACAO_MENSAGEM, NOTIFICACAO_REMETENTE, NOTIFICACAO_DESTINATARIO, NOTIFICACAO_DATA_CRIACAO, F_USUARIO_ID, NOTIFICACAO_STATUS) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [titulo, assunto, mensagem, remetente, destinatario, usuarioId || null, status || 'pendente']
    );
    const [rows] = await pool.query('SELECT * FROM D_NOTIFICACAO WHERE ID_NOTIFICACAO = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar notificação', details: err.message });
  }
});

// Listar todas as notificações
app.get('/notificacoes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM D_NOTIFICACAO');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificações', details: err.message });
  }
});

// Buscar notificação por ID
app.get('/notificacoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM D_NOTIFICACAO WHERE ID_NOTIFICACAO = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Notificação não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificação', details: err.message });
  }
});

// Atualizar notificação
app.put('/notificacoes/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, assunto, mensagem, remetente, destinatario, usuarioId, status } = req.body;
  if (!titulo && !assunto && !mensagem && !remetente && !destinatario && !usuarioId && !status) return res.status(400).json({ error: 'Nenhum dado para atualizar' });
  let fields = [];
  let values = [];
  if (titulo) { fields.push('NOTIFICACAO_TITULO = ?'); values.push(titulo); }
  if (assunto) { fields.push('NOTIFICACAO_ASSUNTO = ?'); values.push(assunto); }
  if (mensagem) { fields.push('NOTIFICACAO_MENSAGEM = ?'); values.push(mensagem); }
  if (remetente) { fields.push('NOTIFICACAO_REMETENTE = ?'); values.push(remetente); }
  if (destinatario) { fields.push('NOTIFICACAO_DESTINATARIO = ?'); values.push(destinatario); }
  if (usuarioId) { fields.push('F_USUARIO_ID = ?'); values.push(usuarioId); }
  if (status) { fields.push('NOTIFICACAO_STATUS = ?'); values.push(status); }
  values.push(id);
  try {
    const [result] = await pool.query(`UPDATE D_NOTIFICACAO SET ${fields.join(', ')} WHERE ID_NOTIFICACAO = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Notificação não encontrada' });
    const [rows] = await pool.query('SELECT * FROM D_NOTIFICACAO WHERE ID_NOTIFICACAO = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar notificação', details: err.message });
  }
});

// Deletar notificação
app.delete('/notificacoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM D_NOTIFICACAO WHERE ID_NOTIFICACAO = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Notificação não encontrada' });
    res.json({ status: 'Notificação deletada' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar notificação', details: err.message });
  }
});

// Enviar notificação por ID
app.post('/notificacoes/:id/enviar', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM D_NOTIFICACAO WHERE ID_NOTIFICACAO = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Notificação não encontrada' });

    const notificacao = rows[0];
    await enviarEmail(notificacao.NOTIFICACAO_REMETENTE, notificacao.NOTIFICACAO_DESTINATARIO, notificacao.NOTIFICACAO_TITULO, notificacao.NOTIFICACAO_MENSAGEM);

    // Atualizar status da notificação para "enviada"
    await pool.query('UPDATE D_NOTIFICACAO SET NOTIFICACAO_STATUS = ? WHERE ID_NOTIFICACAO = ?', ['enviada', id]);

    res.json({ status: 'Notificação enviada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar notificação', details: err.message });
  }
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Notificacoes Service rodando na porta ${PORT}`);
});