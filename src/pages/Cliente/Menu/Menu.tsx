import React from "react";
import { useMenu } from "../../../contexts/MenuItemContext";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate

export default function MenuPage() {
  const { 
    filteredItems, 
    activeCategory, 
    categories, 
    setActiveCategory,
    isLoading,
    error
  } = useMenu();
  
  const navigate = useNavigate(); 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-amber-600 text-2xl">Carregando cardápio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegação fixa */}
      <nav className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-800">Menu SC</h1>
          
          <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botão de perfil */}
            <button 
              onClick={() => navigate('/perfil')}
              className="p-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              aria-label="Perfil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Botão do carrinho */}
            <button className="p-2 rounded-full bg-amber-100 text-amber-800 relative" onClick={() => navigate('/carrinhoDeCompras')}>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Restante do código permanece igual */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-amber-800 capitalize">
          {categories.find(c => c.id === activeCategory)?.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">{item.nome}</h3>
                  <span className="text-lg font-bold text-amber-600">
                    R$ {(item.preco / 100).toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{item.descricao}</p>
                <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                  {item.disponibilidade ? "Adicionar ao carrinho" : "Indisponível"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}