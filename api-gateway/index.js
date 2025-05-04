require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

app.use(cors());

// Verificando se o micro serviço API  está online
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Configuração de proxy para os micros serviços 
app.use('/auth', createProxyMiddleware({ target: process.env.AUTH_SERVICE_URL, changeOrigin: true }));
app.use('/pacientes', createProxyMiddleware({ target: process.env.PACIENTES_SERVICE_URL, changeOrigin: true }));
app.use('/medicos', createProxyMiddleware({ target: process.env.MEDICOS_SERVICE_URL, changeOrigin: true }));
app.use('/reabilitacao', createProxyMiddleware({ target: process.env.REABILITACAO_SERVICE_URL, changeOrigin: true }));
app.use('/questionarios', createProxyMiddleware({ target: process.env.QUESTIONARIOS_SERVICE_URL, changeOrigin: true }));
app.use('/notificacoes', createProxyMiddleware({ target: process.env.NOTIFICACOES_SERVICE_URL, changeOrigin: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0' ,() => {
  console.log(`API Gateway rodando na porta de serviço: ${PORT}`);
});