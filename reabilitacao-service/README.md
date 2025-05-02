# Reabilitação Service

Responsável pelo gerenciamento das reabilitações no sistema FisioHub.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3004
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=grupo25@UniforADS
DB_NAME=sistema_clinico
```

## Como rodar

```bash
npm install
npm start
```

O serviço ficará disponível em `http://localhost:3004`.

## Endpoints
- `GET /reabilitacao` — Lista todas as reabilitações
- `GET /health` — Health check

--- 