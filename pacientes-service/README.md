# Pacientes Service

Responsável pelo gerenciamento dos usuários do tipo Paciente no sistema FisioHub.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3002
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

O serviço ficará disponível em `http://localhost:3002`.

## Endpoints
- `GET /pacientes` — Lista todos os pacientes
- `GET /health` — Health check

--- 