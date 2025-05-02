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

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Enviar notificação por e-mail e salvar no banco
app.post('/notificacoes', async (req, res) => {
  const { titulo, assunto, mensagem, remetente, destinatario, usuarioId } = req.body;
  if (!titulo || !mensagem || !remetente || !destinatario) return res.status(400).json({ error: 'Dados obrigatórios' });
  try {
    // Enviar e-mail
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.sendMail({
      from: remetente,
      to: destinatario,
      subject: titulo,
      text: mensagem
    });
    // Salvar notificação no banco
    await pool.query(
      'INSERT INTO D_NOTIFICACAO (NOTIFICACAO_TITULO, NOTIFICACAO_ASSUNTO, NOTIFICACAO_MENSAGEM, NOTIFICACAO_REMETENTE, NOTIFICACAO_DESTINATARIO, NOTIFICACAO_DATA_CRIACAO, F_USUARIO_ID) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
      [titulo, assunto, mensagem, remetente, destinatario, usuarioId || null]
    );
    res.json({ status: 'Notificação enviada e salva' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar notificação', details: err.message });
  }
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Notificacoes Service rodando na porta ${PORT}`);
}); 