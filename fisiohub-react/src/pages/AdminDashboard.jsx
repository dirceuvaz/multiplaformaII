import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Importa o CSS

const USERS_PER_PAGE = 5; // Define quantos usuários mostrar inicialmente e a cada clique

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [displayCount, setDisplayCount] = useState(USERS_PER_PAGE); // Estado para controlar quantos usuários exibir

  const fetchPendingUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const response = await fetch('/api/auth/usuarios/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'GP25apiKEYADS2k25',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar usuários pendentes');
      }

      const usersData = await response.json();
      setPendingUsers(usersData);

    } catch (err) {
      console.error('Erro ao buscar usuários pendentes:', err);
      setUsersError(err.message || 'Não foi possível carregar os usuários pendentes.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + USERS_PER_PAGE);
  };

  const handleLogout = () => {
    console.log('Deslogando Administrador...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="admin-dashboard-nav">
        <div className="admin-dashboard-logo">
          Admin FisioHub
        </div>
        <div className="admin-dashboard-nav-links">
          <a href="/admin/usuarios" className="admin-dashboard-nav-link">Gerenciar Usuários</a>
          <a href="#" className="admin-dashboard-nav-link">Gerenciar Clínicas</a>
          <a href="#" className="admin-dashboard-nav-link">Relatórios</a>
          <button onClick={handleLogout} className="admin-dashboard-nav-link">Deslogar</button>
        </div>
      </nav>

      <h1 className="admin-dashboard-title">Dashboard do Administrador</h1>

      <div className="admin-dashboard-section">
        <h3>Resumo do Sistema</h3>
        <p>Visão geral das estatísticas e atividades.</p>
      </div>

      <div className="admin-dashboard-section">
        <h3>Últimos Cadastros Pendentes</h3>
        {loadingUsers && <p>Carregando usuários...</p>}
        {usersError && <p className="error-message">{usersError}</p>}
        {!loadingUsers && !usersError && pendingUsers.length === 0 && (
          <p>Não há cadastros pendentes no momento.</p>
        )}
        {!loadingUsers && !usersError && pendingUsers.length > 0 && (
          <>
            <ul>
              {pendingUsers.slice(0, displayCount).map(user => (
                <li key={user.ID_USUARIO}>
                  {user.USUARIO_NOME} - {user.USUARIO_EMAIL} ({user.F_USUARIO_ID_USUARIO_PERFIL === 3 ? 'Paciente' : user.F_USUARIO_ID_USUARIO_PERFIL === 2 ? 'Médico' : user.F_USUARIO_ID_USUARIO_PERFIL === 1 ? 'Administrador' : user.F_USUARIO_ID_USUARIO_PERFIL})
                </li>
              ))}
            </ul>
            {displayCount < pendingUsers.length && (
              <button onClick={handleShowMore} className="admin-dashboard-link" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                Mostrar Mais
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
} 