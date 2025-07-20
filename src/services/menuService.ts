import api from "./authService";

/**
 * Tipo representando um item do cardápio
 */
export type MenuItem = {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // Em centavos (ex: R$ 20,50 = 2050)
  categoria: string;
  disponibilidade: boolean;
  fotos?: string[]; // URLs das imagens
};

/**
 * Obtém todos os itens do cardápio
 */
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await api.get("/menu-items");
  return response.data;
};

/**
 * Cria um novo item no cardápio
 * @param itemData Dados do item em FormData (incluindo fotos)
 */
export const createMenuItem = async (itemData: FormData): Promise<MenuItem> => {
  const response = await api.post("/menu-items", itemData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Atualiza um item existente no cardápio
 * @param id ID do item a ser atualizado
 * @param itemData Dados atualizados em FormData
 */
export const updateMenuItem = async (id: string, itemData: FormData): Promise<MenuItem> => {
  const response = await api.put(`/menu-items/${id}`, itemData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Remove um item do cardápio
 * @param id ID do item a ser removido
 */
export const deleteMenuItem = async (id: string): Promise<void> => {
  await api.delete(`/menu-items/${id}`);
};

/**
 * Atualiza a disponibilidade de um item
 * @param id ID do item
 * @param disponibilidade Novo status de disponibilidade
 */
export const updateItemAvailability = async (
  id: string,
  disponibilidade: boolean
): Promise<MenuItem> => {
  const response = await api.patch(`/menu-items/${id}/disponibilidade`, { disponibilidade });
  return response.data;
};

/**
 * Busca itens por categoria
 * @param categoryId ID da categoria
 */
export const getItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
  const response = await api.get(`/menu-items/category/${categoryId}`);
  return response.data;
};

/**
 * Busca itens por nome (busca parcial)
 * @param query Termo de busca
 */
export const searchItemsByName = async (query: string): Promise<MenuItem[]> => {
  const response = await api.get("/menu-items/search", {
    params: { query },
  });
  return response.data;
};