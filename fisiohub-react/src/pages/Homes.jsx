import { Link } from "react-router-dom";
import "./Homes.css";

function Home() {
  return (
    <div className="homes-container">
      <div className="homes-content">
        <h1 className="homes-title">FisioHub</h1>
        <p className="homes-description">
          Bem-vindo à FisioHub, sua plataforma moderna para agendamentos e
          gerenciamento de fisioterapia. Aqui você encontra os melhores
          profissionais para cuidar da sua saúde.
        </p>
        <div className="homes-buttons">
          <Link to="/login" className="btn-primary">
            Entrar
          </Link>
          <Link to="/cadastro" className="btn-secondary">
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
