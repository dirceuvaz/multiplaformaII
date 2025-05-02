# Médicos Service

Responsável pelo gerenciamento dos usuários do tipo Médico no sistema FisioHub.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3003
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

O serviço ficará disponível em `http://localhost:3003`.

## Endpoints
- `GET /medicos` — Lista todos os médicos (com CRM e especialidade)
- `GET /health` — Health check

--- 