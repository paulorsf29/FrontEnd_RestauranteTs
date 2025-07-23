// src/pages/Cliente/Perfil.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/authService";

type Endereco = {
  id: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  zipcode: string;
  isDefalt: boolean;
};

export default function Perfil() {
  const { user } = useAuth();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [novoEndereco, setNovoEndereco] = useState<Omit<Endereco, 'id' | 'isDefalt'>>({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    zipcode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarEnderecos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/addresses', {
          headers: {
            'X-Customer-Id': user?.id
          }
        });
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
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          zipcode: cep,
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
      const response = await api.post('/api/addresses', novoEndereco, {
        headers: {
          'X-Customer-Id': user?.id
        }
      });
      setEnderecos([...enderecos, response.data]);
      setNovoEndereco({
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        zipcode: '',
      });
      setError('');
    } catch (err) {
      setError('Erro ao cadastrar endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      setLoading(true);
      await api.patch(`/api/addresses/${addressId}/default`, {}, {
        headers: {
          'X-Customer-Id': user?.id
        }
      });
      // Atualiza a lista de endereços
      const response = await api.get('/api/addresses', {
        headers: {
          'X-Customer-Id': user?.id
        }
      });
      setEnderecos(response.data);
    } catch (err) {
      setError('Erro ao definir endereço padrão');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Carregando dados do usuário...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ... (mantenha a seção de dados pessoais igual) ... */}
      
      {/* Seção de Endereços */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Meus Endereços</h2>
        
        {loading && enderecos.length === 0 && <p>Carregando endereços...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {enderecos.map((endereco) => (
          <div key={endereco.id} className="border-b border-gray-200 py-4 last:border-0">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  {endereco.rua}, {endereco.numero}
                  {endereco.complemento && `, ${endereco.complemento}`}
                </p>
                <p>
                  {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                </p>
                <p className="text-gray-500">CEP: {endereco.zipcode}</p>
              </div>
              <div>
                {endereco.isDefalt ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Padrão</span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(endereco.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    disabled={loading}
                  >
                    Tornar padrão
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Formulário de novo endereço - atualize os campos para match com o backend */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Atualize os campos conforme sua entidade Address */}
          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={novoEndereco.zipcode}
              onChange={handleInputChange}
              onBlur={handleCEPBlur}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
              maxLength={9}
              pattern="\d{5}-?\d{3}"
            />
          </div>
          
          <div>
            <label htmlFor="rua" className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              type="text"
              id="rua"
              name="rua"
              value={novoEndereco.rua}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              required
            />
          </div>
          
          {/* Adicione os outros campos conforme necessário */}
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? 'Salvando...' : 'Salvar Endereço'}
          </button>
        </form>
      </div>
    </div>
  );
}