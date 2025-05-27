import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/forms.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear potential errors on input change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    if (errors.submit) {
       setErrors(prev => ({ ...prev, submit: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'GP25apiKEYADS2k25' // Incluindo a chave de API
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const userData = await response.json();
      console.log('Login successful, user data:', userData);

      // Redirecionar baseado no perfil
      switch (userData.perfil) {
        case 1: // Administrador
          navigate('/admin/dashboard'); // Assumindo uma rota para admin
          break;
        case 2: // Medico
          navigate('/medico/dashboard'); // Assumindo uma rota para médico
          break;
        case 3: // Paciente
          navigate('/paciente/dashboard'); // Rota que já existe no App.jsx
          break;
        default:
          setErrors({ submit: 'Perfil de usuário desconhecido.' });
          // Opcional: redirecionar para uma página de erro ou login novamente
          // navigate('/login');
      }

      // TODO: Salvar token e dados do usuário no armazenamento local (localStorage/context)
      // localStorage.setItem('token', userData.token);
      // localStorage.setItem('user', JSON.stringify(userData));

    } catch (err) {
      let errorMsg = err.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setErrors({
        submit: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h1 className="form-title">Login</h1>
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
             {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              className={`form-input ${errors.senha ? 'error' : ''}`}
              value={formData.senha}
              onChange={handleChange}
              required
            />
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>
          <button
             type="submit"
             className="form-button"
             disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <Link to="/cadastro" className="form-link">Ainda não tem conta? Cadastre-se</Link>
      </div>
    </div>
  );
}