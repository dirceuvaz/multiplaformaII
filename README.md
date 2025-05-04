# FisioHub - Microsserviços

Este projeto desenvolvido é uma arquitetura de microsserviços para atender um sistema de gestão de pacientes, desenvolvido em Node.js, com banco de dados MySQL e comunicação via API Gateway.

---

## **Arquitetura**

- **API Gateway:** Roteia todas as requisições para os microsserviços.
- **auth-service:** Cadastro, autenticação e CRUD de usuários (centraliza criação de pacientes e médicos).
- **pacientes-service:** Apenas leitura de pacientes (GET). Cadastro/edição/deleção centralizados no auth-service.
- **medicos-service:** CRUD completo de médicos (dados de usuário e médicos).
- **reabilitacao-service:** CRUD completo de reabilitações, sempre vinculado a um usuário.
- **questionarios-service:** CRUD completo de questionários, sempre vinculado a um usuário.
- **notificacoes-service:** CRUD completo de notificações, com envio de e-mail e campo status.
- **MySQL:** Banco de dados relacional, com volume persistente.

---

## Estrutura de Pastas

```
microsservicos/
  api-gateway/
  auth-service/
  pacientes-service/
  medicos-service/
  reabilitacao-service/
  questionarios-service/
  notificacoes-service/
  mysql-init/
    fisiohub.sql
  docker-compose.yml
  README.md (este arquivo)
```

---

## **Como rodar o projeto**

1. **Configure os arquivos `.env`** em cada serviço, conforme os exemplos `.env`.
2. **Garanta que o Docker Desktop está rodando em seu SERVIDOR**
3. **Suba todos os serviços com Docker Compose:**
   ```bash
   docker-compose up --build
   ```
4. O banco será inicializado automaticamente com o script `fisiohub.sql`.
5. Acesse o API Gateway em `http://localhost:3000`. Ou acesse com seu IP.

---

## **Endpoints principais (via API Gateway)**

### **1. Usuários (auth-service)**

- **Cadastro de usuário (retorna token):**
  - `POST http://localhost:3000/auth/register`
  - **Body (JSON):**
    ```json
    {
      "nome": "Sofia Cunha",
      "email": "sofia.cunha@gmail.com",
      "senha": "senha123",
      "perfil": 2,
      "cpf": "12345678222",
      "genero": "Feminino",
      "cirurgia": "2025-05-01"
    }
    ```

- **Login de usuário (retorna token):**
  - `POST http://localhost:3000/auth/login`
  - **Body (JSON):**
    ```json
    {
      "email": "sofia.cunha@gmail.com",
      "senha": "senha123"
    }
    ```

- **Listar todos os usuários:**
  - `GET http://localhost:3000/auth/usuarios`

- **Buscar usuário por ID:**
  - `GET http://localhost:3000/auth/usuarios/:id`

- **Atualizar usuário:**
  - `PUT http://localhost:3000/auth/usuarios/:id`
  - **Body (JSON):**
    ```json
    {
      "nome": "Sofia Cunha Atualizada",
      "email": "sofia.cunha@gmail.com",
      "perfil": 2,
      "cpf": "12345678222",
      "genero": "Feminino",
      "cirurgia": "2025-06-01"
    }
    ```

- **Deletar usuário:**
  - `DELETE http://localhost:3000/auth/usuarios/:id`

---

### **2. Pacientes (pacientes-service)**

- **Listar todos os pacientes:**
  - `GET http://localhost:3000/pacientes`

---

### **3. Médicos (medicos-service)**

- **Listar todos os médicos:**
  - `GET http://localhost:3000/medicos`

- **Buscar médico por ID:**
  - `GET http://localhost:3000/medicos/:id`

- **Atualizar médico:**
  - `PUT http://localhost:3000/medicos/:id`
  - **Body (JSON):**
    ```json
     {
        "id": 6,
        "nome": "João Bosco",
        "email": "joao.bosco@gmail.com",
        "cpf": "00000000000",
        "genero": null
    }
    ```

- **Deletar médico:**
  - `DELETE http://localhost:3000/medicos/:id`

---

### **4. Reabilitação (reabilitacao-service)**

- **Criar reabilitação:**
  - `POST http://localhost:3000/reabilitacao`
  - **Body (JSON):**
    ```json
    {
      "nome": "Reabilitação B",
      "desc": "Descrição B",
      "momento": "Momento B",
      "desc_momento": "Descrição do Momento B",
      "ordem": 2,
      "usuarioId": 7
    }
    ```

- **Listar todas as reabilitações:**
  - `GET http://localhost:3000/reabilitacao`

- **Buscar reabilitação por ID:**
  - `GET http://localhost:3000/reabilitacao/:id`

- **Atualizar reabilitação:**
  - `PUT http://localhost:3000/reabilitacao/:id`
  - **Body (JSON):**
    ```json
    {
      "nome": "Reabilitação Atualizada",
      "desc": "Descrição Atualizada",
      "momento": "Momento Atualizado",
      "desc_momento": "Descrição do Momento Atualizado",
      "ordem": 5,
      "usuarioId": null
    }
    ```

- **Deletar reabilitação:**
  - `DELETE http://localhost:3000/reabilitacao/:id`

---

### **5. Questionários (questionarios-service)**

- **Criar questionário:**
  - `POST http://localhost:3000/questionarios`
  - **Body (JSON):**
    ```json
    {
      "titulo": "Questionário A",
      "desc": "Descrição do questionário A",
      "pergunta": "Qual é a sua opinião?",
      "nota": "10",
      "resposta": "Resposta A",
      "usuarioId": 1
    }
    ```

- **Listar todos os questionários:**
  - `GET http://localhost:3000/questionarios`

- **Buscar questionário por ID:**
  - `GET http://localhost:3000/questionarios/:id`

- **Atualizar questionário:**
  - `PUT http://localhost:3000/questionarios/:id`
  - **Body (JSON):**
    ```json
    {
    "titulo": "Questionário Atualizado",
    "desc": "Descrição Atualizada",
    "pergunta": "Pergunta Atualizada",
    "nota": "9",
    "resposta": "Resposta Atualizada",
    "usuarioId": 2
    }
    ```

- **Deletar questionário:**
  - `DELETE http://localhost:3000/questionarios/:id`

---

### **6. Notificações (notificacoes-service)**

- **Criar notificação:**
  - `POST http://localhost:3000/notificacoes`
  - **Body (JSON):**
    ```json
    {
    "titulo": "Bem-vindo ao sistema!",
    "assunto": "Criação de Acesso",
    "mensagem": "Seu acesso foi criado com sucesso.",
    "remetente": "admin@clinica.com",
    "destinatario": "paciente.GP25ads@gmail.com",
    "usuarioId": 3,
    "status": "pendente"
    }
      ```

- **Listar todas as notificações:**
  - `GET http://localhost:3000/notificacoes`

- **Buscar notificação por ID:**
  - `GET http://localhost:3000/notificacoes/:id`

- **Atualizar notificação:**
  - `PUT http://localhost:3000/notificacoes/:id`
  - **Body (JSON):**
    ```json
    {
      "titulo": "Notificação Atualizada",
      "assunto": "Atualização de Cadastro",
      "mensagem": "Seus dados foram atualizados com sucesso.",
      "remetente": "admin@clinica.com",
      "destinatario": "paciente.GP25ads@gmail.com",
      "status": "enviada"
    }
    ```

- **Deletar notificação:**
  - `DELETE http://localhost:3000/notificacoes/:id`

- **Enviar notificação por ID:**
  - `POST http://localhost:3000/notificacoes/:id/enviar`

---

## **Como usar no Postman**

1. **Importe os endpoints no Postman**:
   - Crie uma nova coleção e adicione os endpoints listados acima.
   - Configure o **Body** do tipo RAW com JSON e os parâmetros conforme necessário.

2. **Autenticação com Token JWT**:
   - Após o login (`POST /auth/login`), copie o token JWT retornado.
   - Adicione o token no **Header** das requisições protegidas:
     ```
     Authorization: Bearer <seu_token_jwt>
     ```

---

## **Exemplo de uso com JavaScript (Frontend)**

Aqui está um exemplo simples de como consumir os endpoints usando **fetch** no frontend:

```javascript
// URL do API Gateway
const API_URL = 'http://localhost:3000'; // MUDE PARA SEU IP

// Função para login
async function login(email, senha) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const data = await response.json();
  if (response.ok) {
    console.log('Login bem-sucedido:', data);
    return data.token; // Retorna o token JWT
  } else {
    console.error('Erro no login:', data);
  }
}

// Função para listar notificações
async function listarNotificacoes(token) {
  const response = await fetch(`${API_URL}/notificacoes`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  if (response.ok) {
    console.log('Notificações:', data);
  } else {
    console.error('Erro ao listar notificações:', data);
  }
}

// Exemplo de uso
(async () => {
  const token = await login('admin@clinica.com', 'adminGP25');
  if (token) {
    await listarNotificacoes(token);
  }
})();
```

---
