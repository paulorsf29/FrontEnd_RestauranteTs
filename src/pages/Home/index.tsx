import { Link } from "react-router-dom";
import "./styles.css";

export default function Home() {
  return (
    <div className="home-layout">
      <div className="text-center">
        <h1 className="home-title">Restaurante SaborConquista</h1>
        <p className="home-subtitle">Sabores que conquistam paladares</p>
      </div>

      <div className="home-buttons">
        <Link to="/login" className="home-primary-button">
          Entrar
        </Link>
        <Link to="/registro" className="home-secondary-button">
          Criar Conta
        </Link>
      </div>

      <div className="home-features">
        <div className="home-feature-card">
          <span className="text-3xl">⚡</span>
          <h3>Pedidos Rápidos</h3>
        </div>
      </div>
    </div>
  );
}