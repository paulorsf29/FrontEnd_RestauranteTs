import React, { useState } from "react";

type MenuItem = {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  categoria: string;
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("pizzas");
  
  // Dados de exemplo - substitua pelos seus produtos reais
  const menuItems: MenuItem[] = [
    {
      id: 1,
      titulo: "Pizza Margherita",
      descricao: "Molho de tomate, mussarela, manjericão",
      preco: 35.90,
      categoria: "pizzas"
    },
    {
      id: 2,
      titulo: "Pizza Calabresa",
      descricao: "Molho de tomate, mussarela, calabresa, cebola",
      preco: 42.90,
      categoria: "pizzas"
    },
    {
      id: 3,
      titulo: "Hambúrguer Clássico",
      descricao: "Pão, hambúrguer 180g, queijo, alface, tomate",
      preco: 28.90,
      categoria: "hamburgueres"
    },
    {
      id: 4,
      titulo: "Picanha",
      descricao: "300g de picanha com farofa e vinagrete",
      preco: 89.90,
      categoria: "churrasco"
    },
    {
      id: 5,
      titulo: "Batata Frita",
      descricao: "Porção de batata frita crocante",
      preco: 18.90,
      categoria: "acompanhamentos"
    },
    {
      id: 6,
      titulo: "Sorvete",
      descricao: "Casquinha com 2 bolas de sorvete",
      preco: 12.90,
      categoria: "gelados"
    }
  ];

  const categories = [
    { id: "pizzas", name: "Pizzas" },
    { id: "hamburgueres", name: "Hambúrgueres" },
    { id: "churrasco", name: "Churrasco" },
    { id: "acompanhamentos", name: "Acompanhamentos" },
    { id: "gelados", name: "Gelados" }
  ];

  const filteredItems = menuItems.filter(item => item.categoria === activeCategory);

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
          
          <button className="p-2 rounded-full bg-amber-100 text-amber-800 relative">
            
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </nav>

      {/* Conteúdo do menu */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-amber-800 capitalize">
          {categories.find(c => c.id === activeCategory)?.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">{item.titulo}</h3>
                  <span className="text-lg font-bold text-amber-600">R$ {item.preco.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-gray-600">{item.descricao}</p>
                <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}