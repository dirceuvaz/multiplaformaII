# FisioHub - Microsserviços

Este projeto é uma arquitetura de microsserviços para um sistema de gestão clínica, desenvolvido em Node.js, com banco de dados MySQL e comunicação via API Gateway.

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

## **Como rodar o projeto**

1. **Configure os arquivos `.env`** em cada serviço, conforme os exemplos `.env.example`.
2. **Garanta que o Docker Desktop está rodando.**
3. **Suba todos os serviços:**
   ```bash
   docker-compose up --build
   ```
4. O banco será inicializado automaticamente com o script `fisiohub.sql`.
5. Acesse o API Gateway em `http://localhost:3000`.

---

## **Uso da Chave de API**

Para consumir os endpoints protegidos, é necessário enviar a **chave de API** no cabeçalho da requisição. A chave de API está configurada no arquivo `.env` do **API Gateway**:

```properties
API_KEY=GP25apiKEYADS2k25
```

### **Como enviar a chave de API**

Adicione o cabeçalho `x-api-key` em todas as requisições:

- **Key**: `x-api-key`
- **Value**: `GP25apiKEYADS2k25`

---

## **Endpoints principais (via API Gateway)**

### **1. Usuários (auth-service)**

- **Cadastro de usuário (retorna token):**
  - `POST /auth/register`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
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
  - `POST /auth/login`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "email": "sofia.cunha@gmail.com",
      "senha": "senha123"
    }
    ```

- **Listar todos os usuários:**
  - `GET /auth/usuarios`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Buscar usuário por ID:**
  - `GET /auth/usuarios/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Atualizar usuário:**
  - `PUT /auth/usuarios/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
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
  - `DELETE /auth/usuarios/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

---

### **2. Pacientes (pacientes-service)**

- **Listar todos os pacientes:**
  - `GET /pacientes`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

---

### **3. Médicos (medicos-service)**

- **Criar médico:**
  - `POST /medicos`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "nome": "Dr. João",
      "email": "dr.joao@gmail.com",
      "especialidade": "Ortopedia",
      "crm": "123456",
      "telefone": "99999-9999"
    }
    ```

- **Listar todos os médicos:**
  - `GET /medicos`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Buscar médico por ID:**
  - `GET /medicos/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Atualizar médico:**
  - `PUT /medicos/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "nome": "Dr. João Atualizado",
      "especialidade": "Fisioterapia",
      "crm": "654321",
      "telefone": "88888-8888"
    }
    ```

- **Deletar médico:**
  - `DELETE /medicos/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

---

### **4. Reabilitação (reabilitacao-service)**

- **Criar reabilitação:**
  - `POST /reabilitacao`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "nome": "Reabilitação Pós-Cirúrgica",
      "descricao": "Foco em recuperação muscular",
      "usuarioId": 1,
      "dataInicio": "2025-05-01",
      "dataFim": "2025-06-01"
    }
    ```

- **Listar todas as reabilitações:**
  - `GET /reabilitacao`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Buscar reabilitação por ID:**
  - `GET /reabilitacao/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Atualizar reabilitação:**
  - `PUT /reabilitacao/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "nome": "Reabilitação Atualizada",
      "descricao": "Nova descrição",
      "dataInicio": "2025-05-15",
      "dataFim": "2025-06-15"
    }
    ```

- **Deletar reabilitação:**
  - `DELETE /reabilitacao/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

---

### **5. Questionários (questionarios-service)**

- **Criar questionário:**
  - `POST /questionarios`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "titulo": "Questionário de Avaliação",
      "descricao": "Avaliação inicial do paciente",
      "perguntas": [
        "Como você se sente hoje?",
        "Qual o nível de dor?"
      ],
      "usuarioId": 1
    }
    ```

- **Listar todos os questionários:**
  - `GET /questionarios`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Buscar questionário por ID:**
  - `GET /questionarios/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Atualizar questionário:**
  - `PUT /questionarios/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "titulo": "Questionário Atualizado",
      "descricao": "Nova descrição",
      "perguntas": [
        "Como você avalia sua recuperação?",
        "Você sente alguma dificuldade?"
      ]
    }
    ```

- **Deletar questionário:**
  - `DELETE /questionarios/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

---

### **6. Notificações (notificacoes-service)**

- **Criar notificação:**
  - `POST /notificacoes`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "titulo": "Bem-vindo ao sistema!",
      "assunto": "Criação de Acesso",
      "mensagem": "Seu acesso foi criado com sucesso.",
      "remetente": "admin@clinica.com",
      "destinatario": "paciente@gmail.com",
      "usuarioId": 1,
      "status": "pendente"
    }
    ```

- **Listar todas as notificações:**
  - `GET /notificacoes`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Buscar notificação por ID:**
  - `GET /notificacoes/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Atualizar notificação:**
  - `PUT /notificacoes/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```
  - **Body (JSON):**
    ```json
    {
      "titulo": "Notificação Atualizada",
      "status": "enviada"
    }
    ```

- **Deletar notificação:**
  - `DELETE /notificacoes/:id`
  - **Headers**:
    ```
    x-api-key: GP25apiKEYADS2k25
    ```

- **Enviar notificação por ID:**
  - `POST /notificacoes/:id/enviar`

---

## **Como usar no Postman**

1. **Adicione o cabeçalho `x-api-key` em todas as requisições**:
   - **Key**: `x-api-key`
   - **Value**: `GP25apiKEYADS2k25`

2. **Configure o Body e os parâmetros conforme necessário**.

3. **Teste os endpoints protegidos**.

---

Se precisar de mais informações ou ajustes, é só avisar! 😊