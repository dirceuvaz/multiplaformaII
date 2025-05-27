import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/forms.css';

// Funções de validação
const validateRequired = (value) => value && value.trim() !== '';
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
const validateDate = (date) => !isNaN(Date.parse(date));

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    genero: '',
    dataCirurgia: '',
    tipo: 'paciente'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validação de nome
    if (!validateRequired(formData.nome)) {
      newErrors.nome = 'Nome é obrigatório';
    }

    // Validação de email
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação de CPF
    if (!validateRequired(formData.cpf)) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    // Validação de senha
    if (!validateRequired(formData.senha)) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!validatePassword(formData.senha)) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres, uma letra e um número';
    }

    // Validação de confirmação de senha
    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    // Validação de gênero
    if (!validateRequired(formData.genero)) {
      newErrors.genero = 'Gênero é obrigatório';
    }

    // Validação de data de cirurgia
    if (formData.dataCirurgia && !validateDate(formData.dataCirurgia)) {
      newErrors.dataCirurgia = 'Data inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        senha: formData.senha,
        genero: formData.genero,
        cirurgia: formData.dataCirurgia || null,
        perfil: formData.tipo === 'paciente' ? 3 : 2 // 3 = Paciente, 2 = Médico
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'GP25apiKEYADS2k25'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao realizar cadastro');
      }

      navigate('/login', { 
        state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' }
      });
    } catch (err) {
      let errorMsg = err.message || 'Erro ao realizar cadastro';
      if (err.message.includes('409')) {
        errorMsg = 'Já existe um usuário cadastrado com este e-mail ou CPF.';
      }
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
        <h1 className="form-title">Cadastro</h1>
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome" className="form-label">Nome completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              className={`form-input ${errors.nome ? 'error' : ''}`}
              value={formData.nome}
              onChange={handleChange}
              required
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

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
            <label htmlFor="cpf" className="form-label">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              className={`form-input ${errors.cpf ? 'error' : ''}`}
              value={formData.cpf}
              onChange={handleChange}
              required
            />
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
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

          <div className="form-group">
            <label htmlFor="confirmarSenha" className="form-label">Confirmar senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              className={`form-input ${errors.confirmarSenha ? 'error' : ''}`}
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
            {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="genero" className="form-label">Gênero</label>
            <select
              id="genero"
              name="genero"
              className={`form-input ${errors.genero ? 'error' : ''}`}
              value={formData.genero}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
            {errors.genero && <span className="error-message">{errors.genero}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dataCirurgia" className="form-label">Data da Cirurgia (opcional)</label>
            <input
              type="date"
              id="dataCirurgia"
              name="dataCirurgia"
              className={`form-input ${errors.dataCirurgia ? 'error' : ''}`}
              value={formData.dataCirurgia}
              onChange={handleChange}
            />
            {errors.dataCirurgia && <span className="error-message">{errors.dataCirurgia}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tipo" className="form-label">Tipo de conta</label>
            <select
              id="tipo"
              name="tipo"
              className="form-input"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="form-button"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <Link to="/login" className="form-link">Já tem uma conta? Faça login</Link>
      </div>
    </div>
  );
}