# FisioHub - Microsserviços

Este projeto é uma arquitetura de microsserviços para um sistema de gestão clínica, desenvolvido em Node.js, com banco de dados MySQL e comunicação via API Gateway. Inclui também uma aplicação frontend em React (Web) e Mobile React Native.

---

## **Pré-requisitos**

Antes de começar, certifique-se de ter instalado:

1. **Docker Desktop**
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Versão recomendada: 4.0.0 ou superior
   - Após a instalação, inicie o Docker Desktop e aguarde até que o ícone fique verde

2. **Node.js**
   - [Download Node.js](https://nodejs.org/)
   - Versão recomendada: 18.x ou superior
   - Para verificar a instalação:
     ```bash
     node --version
     npm --version
     ```

3. **Git**
   - [Download Git](https://git-scm.com/downloads)
   - Para verificar a instalação:
     ```bash
     git --version
     ```

---

## **Arquitetura**

### Backend (Microsserviços)
- **API Gateway:** Roteia todas as requisições para os microsserviços.
- **auth-service:** Cadastro, autenticação e CRUD de usuários (centraliza criação de pacientes e médicos).
- **pacientes-service:** Apenas leitura de pacientes (GET). Cadastro/edição/deleção centralizados no auth-service.
- **medicos-service:** CRUD completo de médicos (dados de usuário e médicos).
- **reabilitacao-service:** CRUD completo de reabilitações, sempre vinculado a um usuário.
- **questionarios-service:** CRUD completo de questionários, sempre vinculado a um usuário.
- **notificacoes-service:** CRUD completo de notificações, com envio de e-mail e campo status.
- **MySQL:** Banco de dados relacional, com volume persistente.

### Frontend
- **fisiohub-react:** Aplicação web desenvolvida em React.js
- **fisiohub-react-native:** Aplicação mobile desenvolvida em React Native

---

## **Como rodar o projeto**

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/fisiohub.git
cd fisiohub
```

### 2. Configure os Arquivos de Ambiente
1. Em cada serviço, copie o arquivo `.env.example` para `.env`:
   ```bash
   # No diretório raiz do projeto
   cp api-gateway/.env.example api-gateway/.env
   cp auth-service/.env.example auth-service/.env
   cp pacientes-service/.env.example pacientes-service/.env
   cp medicos-service/.env.example medicos-service/.env
   cp reabilitacao-service/.env.example reabilitacao-service/.env
   cp questionarios-service/.env.example questionarios-service/.env
   cp notificacoes-service/.env.example notificacoes-service/.env
   ```

2. Verifique se as variáveis de ambiente estão corretas em cada arquivo `.env`

### 3. Inicie os Serviços
1. **Garanta que o Docker Desktop está rodando**
   - Verifique se o ícone do Docker está verde na barra de tarefas
   - Se não estiver, abra o Docker Desktop e aguarde a inicialização

2. **Suba todos os serviços:**
   ```bash
   docker-compose up --build
   ```
   - Na primeira execução, isso pode levar alguns minutos
   - Aguarde até ver a mensagem "Ready for connections" do MySQL

3. **Verifique se todos os serviços estão rodando:**
   ```bash
   docker-compose ps
   ```
   - Todos os serviços devem mostrar status "Up"

### 4. Acesse as Aplicações
- API Gateway: `http://localhost:3000`
- Aplicação Web (React): `http://localhost:3007`

### 5. Teste a Instalação
1. Acesse `http://localhost:3007` no navegador
2. Você deve ver a tela de login da aplicação
3. Se encontrar algum erro, verifique os logs:
   ```bash
   docker-compose logs -f
   ```

### **Solução de Problemas Comuns**

1. **Erro de Porta em Uso**
   - Verifique se as portas 3000, 3001-3008 não estão em uso
   - Para verificar portas em uso (Windows):
     ```bash
     netstat -ano | findstr :3000
     ```
   - Para verificar portas em uso (Linux/Mac):
     ```bash
     lsof -i :3000
     ```

2. **Erro de Conexão com o MySQL**
   - Aguarde alguns minutos após iniciar os serviços
   - Verifique os logs do MySQL:
     ```bash
     docker-compose logs mysql
     ```

3. **Erro de Build**
   - Limpe os containers e imagens:
     ```bash
     docker-compose down
     docker system prune -a
     ```
   - Tente novamente:
     ```bash
     docker-compose up --build
     ```

4. **Erro de Permissão**
   - No Windows, execute o PowerShell como administrador
   - No Linux/Mac, use sudo:
     ```bash
     sudo docker-compose up --build
     ```

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
