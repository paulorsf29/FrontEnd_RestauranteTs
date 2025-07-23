import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/authService";

type ItemPedido = {
  id: string;
  nome: string;
  quantidade: number;
  observacao?: string;
};

type Pedido = {
  id: string;
  numero: string;
  itens: ItemPedido[];
  status: 'PENDENTE' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE';
  horario: string;
  tipo: 'DELIVERY' | 'TAKEOUT';
};

export default function CardapioCozinha() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState<'TODOS' | 'PENDENTES' | 'EM_PREPARO'>('PENDENTES');

  // Carrega os pedidos
  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/pedidos/cozinha');
        setPedidos(response.data);
      } catch (err) {
        setError('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };

    // Atualiza a cada 30 segundos
    carregarPedidos();
    const interval = setInterval(carregarPedidos, 30000);

    return () => clearInterval(interval);
  }, [filtro]);

  const atualizarStatus = async (pedidoId: string, novoStatus: 'EM_PREPARO' | 'PRONTO') => {
    try {
      setLoading(true);
      await api.patch(`/api/pedidos/${pedidoId}/status`, { status: novoStatus });
      setPedidos(pedidos.map(p => 
        p.id === pedidoId ? { ...p, status: novoStatus } : p
      ));
    } catch (err) {
      setError(`Erro ao atualizar pedido ${pedidoId}`);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPedidos = () => {
    switch (filtro) {
      case 'PENDENTES':
        return pedidos.filter(p => p.status === 'PENDENTE');
      case 'EM_PREPARO':
        return pedidos.filter(p => p.status === 'EM_PREPARO');
      default:
        return pedidos.filter(p => p.status !== 'ENTREGUE');
    }
  };

  if (!user || user.role !== 'KITCHEN') {
    return <div>Acesso restrito à equipe de cozinha</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Painel de Controle da Cozinha</h1>
      
      {/* Filtros */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFiltro('PENDENTES')}
          className={`px-4 py-2 rounded ${filtro === 'PENDENTES' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFiltro('EM_PREPARO')}
          className={`px-4 py-2 rounded ${filtro === 'EM_PREPARO' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Em Preparo
        </button>
        <button
          onClick={() => setFiltro('TODOS')}
          className={`px-4 py-2 rounded ${filtro === 'TODOS' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Todos
        </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtrarPedidos().length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </div>
          ) : (
            filtrarPedidos().map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 
                ${pedido.status === 'PENDENTE' ? 'border-yellow-500' : 
                  pedido.status === 'EM_PREPARO' ? 'border-blue-500' : 'border-green-500'}"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">Pedido #{pedido.numero}</h2>
                    <span className={`px-2 py-1 text-xs rounded-full 
                      ${pedido.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' : 
                        pedido.status === 'EM_PREPARO' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {pedido.status === 'PENDENTE' ? 'Pendente' : 
                       pedido.status === 'EM_PREPARO' ? 'Em Preparo' : 'Pronto'}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-3">
                    {new Date(pedido.horario).toLocaleTimeString()} - {pedido.tipo === 'DELIVERY' ? 'Delivery' : 'Balcão'}
                  </p>

                  <div className="border-t border-gray-200 pt-3">
                    <h3 className="font-medium mb-2">Itens:</h3>
                    <ul className="space-y-2">
                      {pedido.itens.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.quantidade}x {item.nome}
                            {item.observacao && <p className="text-xs text-gray-500">Obs: {item.observacao}</p>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
                    {pedido.status === 'PENDENTE' && (
                      <button
                        onClick={() => atualizarStatus(pedido.id, 'EM_PREPARO')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        disabled={loading}
                      >
                        Iniciar Preparo
                      </button>
                    )}
                    {pedido.status === 'EM_PREPARO' && (
                      <button
                        onClick={() => atualizarStatus(pedido.id, 'PRONTO')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        disabled={loading}
                      >
                        Marcar como Pronto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}