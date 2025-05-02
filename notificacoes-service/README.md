# Notificações Service

Responsável pelo envio de notificações por e-mail e registro no banco de dados no sistema FisioHub.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3006
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=grupo25@UniforADS
DB_NAME=sistema_clinico
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=fisiohub.grupo25ads@email.com
SMTP_PASS=grupo25@UniforADS
```

## Como rodar

```bash
npm install
npm start
```

O serviço ficará disponível em `http://localhost:3006`.

## Endpoints
- `POST /notificacoes` — Envia notificação por e-mail e salva no banco
- `GET /health` — Health check

--- 