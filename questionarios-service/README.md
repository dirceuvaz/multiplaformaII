# Questionários Service

Responsável pelo gerenciamento dos questionários no sistema FisioHub.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3005
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

O serviço ficará disponível em `http://localhost:3005`.

## Endpoints
- `GET /questionarios` — Lista todos os questionários
- `GET /health` — Health check

--- 