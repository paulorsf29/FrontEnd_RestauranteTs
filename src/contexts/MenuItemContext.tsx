// src/contexts/MenuContext.tsx
import { createContext, useContext, useState } from "react";
import { getMenuItems } from "../services/menuService";

/**
 * Tipo que representa um item do cardápio.
 */
type MenuItem = {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // Em centavos (ex: R$ 20,50 = 2050)
  categoria: string;
  disponibilidade: boolean;
  fotos?: string[]; // URLs das imagens
};

/**
 * Tipo do contexto do cardápio.
 */
type MenuContextType = {
  menuItems: MenuItem[];
  loadMenuItems: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

// Cria o contexto com valores padrão
const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  loadMenuItems: async () => {},
  isLoading: false,
  error: null,
});

/**
 * Hook personalizado para acessar o contexto do cardápio.
 * @returns {MenuContextType} O contexto do cardápio.
 */
export const useMenu = () => useContext(MenuContext);

/**
 * Provedor do contexto do cardápio.
 * Gerencia o estado dos itens do cardápio e fornece funções para carregá-los.
 */
export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega os itens do cardápio da API.
   */
  const loadMenuItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError("Falha ao carregar o cardápio. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MenuContext.Provider value={{ menuItems, loadMenuItems, isLoading, error }}>
      {children}
    </MenuContext.Provider>
  );
}