# Auth Service

Responsável pelo cadastro e autenticação de usuários do sistema FisioHub, gerando tokens JWT.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=grupo25@UniforADS
DB_NAME=sistema_clinico
JWT_SECRET=grupo25@UniforADS
```

## Como rodar

```bash
npm install
npm start
```

O serviço ficará disponível em `http://localhost:3001`.

## Endpoints
- `POST /auth/register` — Cadastro de usuário
- `POST /auth/login` — Login de usuário
- `GET /health` — Health check

--- 