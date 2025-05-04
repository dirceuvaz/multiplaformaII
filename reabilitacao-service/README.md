# Reabilitação Service

Responsável pelo gerenciamento das reabilitações no sistema FisioHub.

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3004
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_clinico
```

## Como rodar

```bash
npm install
npm start
```

O serviço ficará disponível em `http://localhost:3004`.

## Endpoints
- `POST /reabilitacao` — Criar reabilitação (valida existência do usuário)
- `GET /reabilitacao` — Lista todas as reabilitações
- `GET /reabilitacao/:id` — Buscar reabilitação por ID
- `PUT /reabilitacao/:id` — Atualizar reabilitação
- `DELETE /reabilitacao/:id` — Deletar reabilitação
- `GET /health` — Health check

**Observação:**
- Sempre valida a existência do usuário antes de criar/atualizar/deletar.

--- 