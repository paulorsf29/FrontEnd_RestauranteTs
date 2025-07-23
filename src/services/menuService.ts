import api from "./authService";

export type MenuItem = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  disponibilidade: boolean;
  fotos?: string[];
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const response = await api.get("/menu-items");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    throw new Error("Falha ao carregar itens do menu");
  }
};

export const createMenuItem = async (itemData: FormData): Promise<MenuItem> => {
  try {
    const response = await api.post("/menu-items", itemData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar item:", error);
    throw new Error("Falha ao criar item no menu");
  }
};

export const updateMenuItem = async (id: string, itemData: FormData): Promise<MenuItem> => {
  try {
    const response = await api.put(`/menu-items/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar item:", error);
    throw new Error("Falha ao atualizar item do menu");
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/menu-items/${id}`);
  } catch (error) {
    console.error("Erro ao deletar item:", error);
    throw new Error("Falha ao deletar item do menu");
  }
};

export const updateItemAvailability = async (
  id: string,
  disponibilidade: boolean
): Promise<MenuItem> => {
  try {
    const response = await api.patch(`/menu-items/${id}/disponibilidade`, { disponibilidade });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar disponibilidade:", error);
    throw new Error("Falha ao atualizar disponibilidade");
  }
};

export const getItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
  try {
    const response = await api.get(`/menu-items/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar por categoria:", error);
    throw new Error("Falha ao buscar itens por categoria");
  }
};

export const searchItemsByName = async (query: string): Promise<MenuItem[]> => {
  try {
    const response = await api.get("/menu-items/search", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar por nome:", error);
    throw new Error("Falha ao buscar itens por nome");
  }
};