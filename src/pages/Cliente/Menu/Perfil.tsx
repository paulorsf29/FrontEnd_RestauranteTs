import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/authService";

type Endereco = {
  id?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export default function Perfil() {
  const { user } = useAuth();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [novoEndereco, setNovoEndereco] = useState<Omit<Endereco, 'id'>>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carrega os endereços do usuário
  useEffect(() => {
    const carregarEnderecos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/enderecos');
        setEnderecos(response.data);
      } catch (err) {
        setError('Erro ao carregar endereços');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      carregarEnderecos();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoEndereco({
      ...novoEndereco,
      [name]: value,
    });
  };

  const buscarCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setNovoEndereco({
          ...novoEndereco,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        });
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const handleCEPBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      buscarCEP(cep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/enderecos', novoEndereco);
      setEnderecos([...enderecos, response.data]);
      setNovoEndereco({
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      });
      setError('');
    } catch (err) {
      setError('Erro ao cadastrar endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Carregando dados do usuário...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      {/* Seção de Dados Pessoais */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="font-medium">{user.nome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="font-medium">{user.telefone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo de Conta</p>
            <p className="font-medium">
              {user.role === 'CUSTOMER' ? 'Cliente' : user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Endereços */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Meus Endereços</h2>
        
        {loading && enderecos.length === 0 && <p>Carregando endereços...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Lista de endereços cadastrados */}
        {enderecos.length > 0 && (
          <div className="mb-6">
            {enderecos.map((endereco) => (
              <div key={endereco.id} className="border-b border-gray-200 py-4 last:border-0">
                <p className="font-medium">
                  {endereco.logradouro}, {endereco.numero}
                  {endereco.complemento && `, ${endereco.complemento}`}
                </p>
                <p>
                  {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                </p>
                <p className="text-gray-500">CEP: {endereco.cep}</p>
              </div>
            ))}
          </div>
        )}

        {/* Formulário de novo endereço */}
        <h3 className="text-lg font-medium mb-3">Adicionar Novo Endereço</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={novoEndereco.cep}
                onChange={handleInputChange}
                onBlur={handleCEPBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
                maxLength={9}
                pattern="\d{5}-?\d{3}"
              />
            </div>
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={novoEndereco.numero}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">Logradouro</label>
            <input
              type="text"
              id="logradouro"
              name="logradouro"
              value={novoEndereco.logradouro}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              type="text"
              id="complemento"
              name="complemento"
              value={novoEndereco.complemento}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={novoEndereco.bairro}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={novoEndereco.cidade}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={novoEndereco.estado}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
                maxLength={2}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? 'Salvando...' : 'Salvar Endereço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}