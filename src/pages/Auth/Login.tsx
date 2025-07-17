import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import "../Home/styles.css";
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate()
  const [email,setEmail] = useState('');
  const [senha,setSenha] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/menu');
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Acesse sua conta</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-amber-800">Email</label>
            <input 
              type="email"
              className="auth-input"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-amber-800">Senha</label>
            <input 
              type="password"
              className="auth-input"
              placeholder="Sua senha"
              required
              value={senha}
              onChange={(e)=> setSenha(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary"
            className="auth-button"
          >
            Entrar
          </Button>
        </form>
        
        <Link to="/registro" className="auth-link">
          Não tem conta? Cadastre-se
        </Link>
      </div>
    </div>
  );
}