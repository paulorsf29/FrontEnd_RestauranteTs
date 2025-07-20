import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import "../Home/styles.css";
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useContext(AuthContext);
  const [erro, setErro] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      return setErro('Preencha todos os campos');
    }

    const { success, message } = await login(email, senha);
    
    if (success) {
      navigate('/menu');
    } else {
      setErro(message || "Email ou senha incorretos");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Acesse sua conta</h2>

        {erro && (
          <div className='auth-error-menssage'>
            {erro}
          </div>
        )}
        
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <Link to="/registro" className="auth-link">
          Não tem conta? Cadastre-se
        </Link>
      </div>
    </div>
  );
}