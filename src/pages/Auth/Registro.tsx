import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import "../Home/styles.css";
import { useState } from 'react';

type userRole = 'gerente' | 'funcionario' | 'cliente' | 'delivery';

export default function Registro() {
  const [role, setRole] = useState<userRole>('cliente');
  const [endereco, setEndereco] = useState('');
  const [email,setEmail] = useState('');
  const [senha,setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [Telefone, setTelefone] = useState('');
  const [ nomeCompleto, setNomeCompleto] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem');
    }
    const dadosDoUsuario = { email, senha, confirmarSenha, Telefone, nomeCompleto, role, ...(role === 'cliente' && {endereco}) };

    console.log(dadosDoUsuario);
    navigate('/menu');
    
    
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h2 className="auth-title">Criar nova conta</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-amber-800">Nome completo</label>
            <input 
              type="text"
              className="auth-input"
              placeholder="Seu nome"
              required
              value={nomeCompleto}
              onChange={(e)=> setNomeCompleto(e.target.value)}
              maxLength={200}
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
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className='block mb-2 text-amber-800'>Telefone</label>
            <input 
            type='tel' 
            className='auth-input' 
            placeholder='(00) 00000-0000'
            required
            value={Telefone}
            onChange={(e) => setTelefone(e.target.value)}
            minLength={11}
            maxLength={11}
            />
          </div>

          <div>
            <label className="block mb-2 text-amber-800">Tipo de usuario</label>
            <div className='grid grid-cols-2 gap-2'>
              <button
                type='button'
                className={`p-2 rounded-md border ${role === 'cliente' ? 'bg-amber-600 text-white' : 'bg-white '
              }`}
                onClick={() => setRole('cliente')}
              >
                Cliente
              </button>
              <button
                type='button'
                className={`p-2 rounded-md border ${role === 'gerente' ? 'bg-amber-600 text-white' : 'bg-white '
              }`}
                onClick={() => setRole('gerente')}
              >
                gerente
              </button>
              <button
                type='button'
                className={`p-2 rounded-md border ${role === 'funcionario' ? 'bg-amber-600 text-white' : 'bg-white '
              }`}
                onClick={() => setRole('funcionario')}
              >
                funcionario
              </button>
              <button
                type='button'
                className={`p-2 rounded-md border ${role === 'delivery' ? 'bg-amber-600 text-white' : 'bg-white '
              }`}
                onClick={() => setRole('delivery')}
              >
                delivery
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-amber-800">Senha</label>
            <input 
              type="password"
              className="auth-input"
              placeholder="Sua senha"
              required = {role === 'cliente'? true : false}
              value={senha}
              onChange={(e)=> setSenha(e.target.value)}
              minLength={6}
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
              onChange={(e)=> setConfirmarSenha(e.target.value)}
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary"
            className="auth-button"
          >
            Cadastrar
          </Button>
        </form>
        
        <Link to="/login" className="auth-link">
          Já tem uma conta? Entrar
        </Link>
      </div>
    </div>
  );
}