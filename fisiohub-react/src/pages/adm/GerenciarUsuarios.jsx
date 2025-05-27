import React, { useEffect, useState } from "react";
// import axios from "axios"; // Remover axios, usar fetch
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './GerenciarUsuarios.css'; // Importar o arquivo CSS

const USERS_PER_PAGE = 12; // Número de usuários por página

const GerenciarUsuarios = () => {
  const navigate = useNavigate(); // Obter a função navigate
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Usuário sendo editado (ou null para novo)
  const [formData, setFormData] = useState({ // Estado para o formulário de criar/editar
    // Inicialize com os campos necessários para criar/editar usuário
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    genero: '',
    cirurgia: '',
    perfil: '', // Perfil do usuário
    // Adicionar outros campos conforme sua API de criação/edição
  });

  // Funções de validação (reutilizar do Cadastro se aplicável)
  const validateRequired = (value) => value && value.trim() !== '';
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Adicionar outras validações conforme necessário

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usando o proxy do Vite e endpoint do Gateway
      const response = await fetch('/api/auth/usuarios/', { // Rota do Gateway
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'GP25apiKEYADS2k25',
          // TODO: Incluir token de autenticação
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar usuários');
      }

      const data = await response.json();
      // TODO: Pode ser necessário filtrar ou transformar os dados aqui
      setUsuarios(data); // Armazena os usuários
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError(err.message || 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // TODO: Verificar autenticação antes de buscar
    fetchUsuarios();
  }, []);

  // Novo estado para a página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular usuários para a página atual
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);

  // Calcular número total de páginas
  const totalPages = Math.ceil(usuarios.length / USERS_PER_PAGE);

  // Funções para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        // Usando o proxy do Vite e endpoint do Gateway para DELETE
        const response = await fetch(`/api/auth/usuarios/${id}`, { // Rota do Gateway
          method: 'DELETE',
          headers: {
            'x-api-key': 'GP25apiKEYADS2k25',
            // TODO: Incluir token de autenticação
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.message || 'Erro ao excluir usuário');
        }

        // Se a exclusão na API for bem-sucedida, atualiza o estado local
        setUsuarios(usuarios.filter((user) => user.ID_USUARIO !== id)); // Usar ID_USUARIO
        console.log(`Usuário com ID ${id} excluído com sucesso.`);

      } catch (err) {
        console.error("Erro ao excluir usuário:", err);
        setError(err.message || 'Não foi possível excluir o usuário.');
      }
    }
  };

  // Funções para gerenciar o modal e formulário
  const handleOpenModal = (user = null) => {
    setCurrentUser(user); // Define o usuário atual (null para novo)
    if (user) {
      // Popula o formulário com os dados do usuário para edição
      setFormData({
        nome: user.USUARIO_NOME || '',
        email: user.USUARIO_EMAIL || '',
        cpf: user.USUARIO_CPF || '',
        senha: '', // Senha geralmente não é preenchida para edição por segurança
        genero: user.USUARIO_GENERO || '',
        cirurgia: user.USUARIO_CIRURGIA ? new Date(user.USUARIO_CIRURGIA).toISOString().split('T')[0] : '', // Formata data
        perfil: user.F_USUARIO_ID_USUARIO_PERFIL || '',
        // Popule outros campos conforme necessário
      });
    } else {
      // Limpa o formulário para novo usuário
      setFormData({
        nome: '',
        email: '',
        cpf: '',
        senha: '',
        genero: '',
        cirurgia: '',
        perfil: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({}); // Limpa o formulário
    setError(null); // Limpa erros
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores

    // TODO: Adicionar validação de formulário mais robusta aqui
    if (!validateRequired(formData.nome) || !validateEmail(formData.email)) {
       setError('Por favor, preencha os campos obrigatórios corretamente.');
       return;
    }

    setLoading(true); // Pode precisar de um estado de loading separado para o modal

    try {
      let response;
      let method;
      let url;

      const userData = { // Dados a serem enviados para a API
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        senha: formData.senha, // Incluir apenas se for criar ou a senha for alterada na edição
        genero: formData.genero,
        cirurgia: formData.cirurgia || null,
        perfil: parseInt(formData.perfil), // Converter perfil para número se necessário
        // Incluir outros campos do formulário
      };

      if (currentUser) {
        // Lógica para editar usuário
        method = 'PUT';
        url = `/api/auth/usuarios/${currentUser.ID_USUARIO}`; // Rota para atualizar
         // Remover senha se não foi alterada
         if (formData.senha === '') {
            delete userData.senha;
         }
      } else {
        // Lógica para criar novo usuário
        method = 'POST';
        url = '/api/auth/register'; // Rota para criar - CORRIGIDA
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'GP25apiKEYADS2k25',
          // TODO: Incluir token de autenticação
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao ${currentUser ? 'atualizar' : 'criar'} usuário`);
      }

      // Atualiza a lista de usuários após sucesso
      fetchUsuarios();
      handleCloseModal(); // Fecha o modal

    } catch (err) {
      console.error(`Erro ao ${currentUser ? 'atualizar' : 'criar'} usuário:`, err);
      setError(err.message || `Não foi possível ${currentUser ? 'atualizar' : 'criar'} o usuário.`);
    } finally {
      setLoading(false); // Pode precisar de um estado de loading separado
    }
  };

  return (
    <div className="gerenciar-usuarios-container">
      <button onClick={() => navigate(-1)} className="back-button">
        Voltar
      </button>
      <h1 className="gerenciar-usuarios-title">
        Gerenciar Usuários
      </h1>
      {error && <div className="error-message">{error}</div>}
      <button
        onClick={() => handleOpenModal()}
        className="add-button"
      >
        Adicionar Novo Usuário
      </button>
      <div className="table-container">
        <table className="users-table">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Email</th>
               <th className="px-4 py-2 text-left">CPF</th>
               <th className="px-4 py-2 text-left">Gênero</th>
               <th className="px-4 py-2 text-left">Perfil</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">Carregando usuários...</td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.ID_USUARIO} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.ID_USUARIO}</td>
                  <td className="px-4 py-2">{user.USUARIO_NOME}</td>
                  <td className="px-4 py-2">{user.USUARIO_EMAIL}</td>
                  <td className="px-4 py-2">{user.USUARIO_CPF}</td>
                  <td className="px-4 py-2">{user.USUARIO_GENERO}</td>
                   <td className="px-4 py-2">{user.F_USUARIO_ID_USUARIO_PERFIL}</td>
                  <td className="px-4 py-2 text-center action-buttons">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(user.ID_USUARIO)}
                      className="delete-button"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      {!loading && usuarios.length > USERS_PER_PAGE && ( /* Mostrar paginação apenas se tiver mais usuários que a página */
        <div className="pagination-controls"> {/* Aplicar classe para estilos */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="pagination-button" /* Aplicar classe para estilos */
          >
            Anterior
          </button>
          <span className="page-info"> {/* Aplicar classe para estilos */}
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="pagination-button" /* Aplicar classe para estilos */
          >
            Próximo
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{currentUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cpf">CPF:</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="form-group">
                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="senha">Senha:</label>
                 <input
                   type="password"
                   id="senha"
                   name="senha"
                   value={formData.senha}
                   onChange={handleFormChange}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   {...(!currentUser && { required: true })}
                 />
                 {currentUser && <p className="text-xs text-gray-600 mt-1">Deixe em branco para não alterar a senha.</p>}
               </div>
               <div className="form-group">
                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genero">Gênero:</label>
                 <select
                   id="genero"
                   name="genero"
                   value={formData.genero}
                   onChange={handleFormChange}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   required
                 >
                   <option value="">Selecione</option>
                   <option value="Masculino">Masculino</option>
                   <option value="Feminino">Feminino</option>
                   <option value="Outro">Outro</option>
                 </select>
               </div>
               <div className="form-group">
                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cirurgia">Data da Cirurgia (opcional):</label>
                 <input
                   type="date"
                   id="cirurgia"
                   name="cirurgia"
                   value={formData.cirurgia}
                   onChange={handleFormChange}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 />
               </div>
               <div className="form-group">
                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="perfil">Perfil:</label>
                 <select
                   id="perfil"
                   name="perfil"
                   value={formData.perfil}
                   onChange={handleFormChange}
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   required
                 >
                   <option value="">Selecione</option>
                   <option value="1">Administrador</option>
                   <option value="2">Médico</option>
                   <option value="3">Paciente</option>
                 </select>
               </div>
              <div className="modal-buttons">
                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (currentUser ? 'Salvar Alterações' : 'Adicionar Usuário')}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarUsuarios;
