import React, { createContext, useContext, useState } from "react";
import { getMenuItems } from "../services/menuService";

type MenuItem = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  disponibilidade: boolean;
  fotos?: string[];
};

type MenuContextType = {
  menuItems: MenuItem[];
  filteredItems: MenuItem[];
  activeCategory: string;
  categories: { id: string; name: string }[];
  loadMenuItems: () => Promise<void>;
  clearMenuItems: () => void;
  setActiveCategory: (category: string) => void;
  isLoading: boolean;
  error: string | null;
};

const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  filteredItems: [],
  activeCategory: "",
  categories: [],
  loadMenuItems: async () => {},
  clearMenuItems: () => {},
  setActiveCategory: () => {},
  isLoading: false,
  error: null
});

export const useMenu = () => useContext(MenuContext);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("pizzas");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: "pizzas", name: "Pizzas" },
    { id: "hamburgueres", name: "Hambúrgueres" },
    { id: "churrasco", name: "Churrasco" },
    { id: "acompanhamentos", name: "Acompanhamentos" },
    { id: "gelados", name: "Gelados" }
  ];

  const filteredItems = menuItems.filter(item => item.categoria === activeCategory);

  const loadMenuItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError("Falha ao carregar o cardápio");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMenuItems = () => {
    setMenuItems([]);
  };

  return (
    <MenuContext.Provider value={{ 
      menuItems,
      filteredItems,
      activeCategory,
      categories,
      loadMenuItems,
      clearMenuItems,
      setActiveCategory,
      isLoading,
      error
    }}>
      {children}
    </MenuContext.Provider>
  );
}