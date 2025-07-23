import React, { useEffect, useState } from "react";
import { useMenu } from "../../contexts/MenuItemContext";
import { createMenuItem, updateMenuItem, deleteMenuItem, type MenuItem } from "../../services/menuService";

const ImageUploader = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleChange}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-amber-50 file:text-amber-700
        hover:file:bg-amber-100"
    />
  );
};

export default function CardapioGerente() {
  const { menuItems, loadMenuItems, isLoading, error } = useMenu();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
    disponibilidade: true,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddPhoto = (file: File) => {
    if (photos.length < 5) {
      setPhotos([...photos, file]);
    } else {
      alert('Máximo de 5 fotos por item');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);
    
    try {
      const itemData = new FormData();
      itemData.append('nome', formData.nome);
      itemData.append('descricao', formData.descricao);
      itemData.append('preco', (parseFloat(formData.preco) * 100).toString());
      itemData.append('categoria', formData.categoria);
      itemData.append('disponibilidade', formData.disponibilidade.toString());
      
      photos.forEach(photo => {
        itemData.append('files', photo);
      });

      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
        setSuccessMessage('Item atualizado com sucesso!');
      } else {
        await createMenuItem(itemData);
        setSuccessMessage('Item criado com sucesso!');
      }
      
      // Reset form
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        categoria: "",
        disponibilidade: true,
      });
      setPhotos([]);
      setEditingItem(null);
      await loadMenuItems();
    } catch (error: any) {
      console.error('Erro ao salvar item:', error);
      setApiError(
        error.response?.data?.message || 
        error.message || 
        'Erro ao salvar item. Verifique os dados e tente novamente.'
      );
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      descricao: item.descricao,
      preco: (item.preco / 100).toString(),
      categoria: item.categoria,
      disponibilidade: item.disponibilidade,
    });
    setPhotos([]);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteMenuItem(id);
        await loadMenuItems();
        setSuccessMessage('Item excluído com sucesso!');
      } catch (error: any) {
        console.error('Erro ao excluir item:', error);
        setApiError(
          error.response?.data?.message || 
          error.message || 
          'Erro ao excluir item'
        );
      }
    }
  };

  if (isLoading) return <div className="p-6">Carregando...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Cardápio</h1>
      
      {apiError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {apiError}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
              <input
                type="number"
                name="preco"
                step="0.01"
                min="0"
                value={formData.preco}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="disponibilidade"
                checked={formData.disponibilidade}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Disponível</label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fotos (Máx. 5)</label>
            <ImageUploader onUpload={handleAddPhoto} />
            
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt={`Preview ${index}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setFormData({
                    nome: "",
                    descricao: "",
                    preco: "",
                    categoria: "",
                    disponibilidade: true,
                  });
                  setPhotos([]);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {editingItem ? 'Atualizar Item' : 'Adicionar Item'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Lista de itens do cardápio */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Itens do Cardápio</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponível</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.nome}</div>
                    <div className="text-sm text-gray-500">{item.descricao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {(item.preco / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.categoria}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.disponibilidade 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.disponibilidade ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}