import axiosClient from './axiosClient';

export const inventoryApi = {
  getIngredients: async (branchId = 1) => {
    const response = await axiosClient.get(`/inventory/ingredients?branchId=${branchId}`);
    return response.data;
  },

  getLowStockIngredients: async (branchId = 1) => {
    const response = await axiosClient.get(`/inventory/low-stock?branchId=${branchId}`);
    return response.data;
  },

  createIngredient: async (ingredientData) => {
    const response = await axiosClient.post('/inventory/ingredients', ingredientData);
    return response.data;
  },

  updateIngredient: async (id, ingredientData) => {
    const response = await axiosClient.put(`/inventory/ingredients/${id}`, ingredientData);
    return response.data;
  },

  recordAdjustment: async (adjustmentData) => {
    const response = await axiosClient.post('/inventory/stock-adjustments', adjustmentData);
    return response.data;
  },
};
