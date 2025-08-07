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
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    const carregarEnderecos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/addresses', {
          headers: {
            'X-Customer-Id': user?.id // Certifique-se que user.id é um UUID válido
          }
        });
        // Adicionar verificação de dados
        if (response.data && Array.isArray(response.data)) {
          setEnderecos(response.data.map((endereco: any) => ({
            ...endereco,
            isDefalt: endereco.isDefault || false // Corrige possível diferença de nome
          })));
        }
      } catch (err) {
        console.error('Erro detalhado:', err);
        setError('Erro ao carregar endereços');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
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
      const novoEnderecoCadastrado = {
      ...response.data,
      isDefalt: response.data.isDefault || false
    };

      setEnderecos([...enderecos, novoEnderecoCadastrado]);
      setNovoEndereco({
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        zipcode: '',
      });
      setShowAddressForm(false);
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
    return <div className="text-center py-8">Carregando dados do usuário...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Seção de Dados Pessoais */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Informações Pessoais</h3>
            <div className="mt-4 space-y-2">
              <p><span className="font-medium">Nome:</span> {user.nome}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Telefone:</span> {user.telefone || 'Não informado'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Ações</h3>
            <div className="mt-4 space-y-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full md:w-auto">
                Editar Perfil
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors w-full md:w-auto">
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Endereços */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Meus Endereços</h2>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            {showAddressForm ? 'Cancelar' : '+ Adicionar Endereço'}
          </button>
        </div>

        {loading && enderecos.length === 0 && (
          <p className="text-center py-4">Carregando endereços...</p>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {enderecos.length === 0 && !showAddressForm ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Você ainda não tem endereços cadastrados</p>
            <button
              onClick={() => setShowAddressForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Adicionar primeiro endereço
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {enderecos.map((endereco) => (
              <div key={endereco.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {endereco.rua}, {endereco.numero}
                      {endereco.complemento && `, ${endereco.complemento}`}
                    </p>
                    <p className="text-gray-600">
                      {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                    </p>
                    <p className="text-gray-500 text-sm">CEP: {endereco.zipcode}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {endereco.isDefalt ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mb-2">
                        Padrão
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(endereco.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm mb-2"
                        disabled={loading}
                      >
                        Tornar padrão
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulário de novo endereço (aparece quando showAddressForm é true) */}
        {showAddressForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">Novo Endereço</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={novoEndereco.zipcode}
                  onChange={handleInputChange}
                  onBlur={handleCEPBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="00000-000"
                  required
                  maxLength={9}
                  pattern="\d{5}-?\d{3}"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700">Rua</label>
                <input
                  type="text"
                  id="rua"
                  name="rua"
                  value={novoEndereco.rua}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  required
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={novoEndereco.complemento || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={novoEndereco.bairro}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  maxLength={2}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
              >
                {loading ? 'Salvando...' : 'Salvar Endereço'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}