import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import "../Home/styles.css";
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

type UserRole = 'ADMIN' | 'KITCHEN' | 'CUSTOMER';

export default function Registro() {
  const { register, isLoading } = useContext(AuthContext);
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      return setErro('As senhas não coincidem');
    }

    if (!nomeCompleto || !email || !telefone || !senha) {
      return setErro('Preencha todos os campos obrigatórios');
    }

    const { success, message } = await register({
      nome: nomeCompleto,
      email,
      senha,
      telefone,
      role,
      ...(role === 'CUSTOMER' && { endereco })
    });

    if (!success) {
      setErro(message || 'Erro ao registrar');
    }
    if (success) {
      switch (role) {
        case 'ADMIN':
          navigate('/cardapioGerente');
          break;
        case 'KITCHEN':
          navigate('/cardapioCozinha');
          break;
        case 'CUSTOMER':
          navigate('/menu');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Criar nova conta</h2>
        {erro && (
          <div className="auth-error-message">
            {erro}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-amber-800">Nome completo</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Seu nome"
              required
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              maxLength={200}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-2 text-amber-800">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block mb-2 text-amber-800'>Telefone</label>
            <input
              type='tel'
              className='auth-input'
              placeholder='(00) 00000-0000'
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              minLength={11}
              maxLength={11}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-2 text-amber-800">Tipo de usuário</label>
            <div className='grid grid-cols-2 gap-2'>
              <button
                type='button'
                className={`p-2 rounded-md border ${role === 'CUSTOMER' ? 'bg-amber-600 text-white' : 'bg-white'}`}
                onClick={() => setRole('CUSTOMER')}
                disabled={isLoading}
              >
                Cliente
              </button>
              <button
                type='button'
                className={`p-2 rounded-md border ${role === 'ADMIN' ? 'bg-amber-600 text-white' : 'bg-white'}`}
                onClick={() => setRole('ADMIN')}
                disabled={isLoading}
              >
                Gerente
              </button>
              <button
                type='button'
                className={`p-2 rounded-md border ${role === 'KITCHEN' ? 'bg-amber-600 text-white' : 'bg-white'}`}
                onClick={() => setRole('KITCHEN')}
                disabled={isLoading}
              >
                Funcionário
              </button>

            </div>
          </div>

          <div>
            <label className="block mb-2 text-amber-800">Senha</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Sua senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-2 text-amber-800">Confirme sua senha</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Confirme sua senha"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <Link to="/login" className="auth-link">
          Já tem uma conta? Entrar
        </Link>
      </div>
    </div>
  );
}