# API Gateway

Este serviço atua como o ponto de entrada para todos os microsserviços do sistema FisioHub, roteando requisições para os serviços apropriados.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
PACIENTES_SERVICE_URL=http://localhost:3002
MEDICOS_SERVICE_URL=http://localhost:3003
REABILITACAO_SERVICE_URL=http://localhost:3004
QUESTIONARIOS_SERVICE_URL=http://localhost:3005
NOTIFICACOES_SERVICE_URL=http://localhost:3006
```

## Como rodar

```bash
npm install
npm start
```

O serviço ficará disponível em `http://localhost:3000`.

## Endpoints
- `/auth/*` → Auth Service
- `/pacientes/*` → Pacientes Service
- `/medicos/*` → Médicos Service
- `/reabilitacao/*` → Reabilitação Service
- `/questionarios/*` → Questionários Service
- `/notificacoes/*` → Notificações Service

--- 