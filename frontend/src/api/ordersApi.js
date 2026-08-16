import axiosClient from './axiosClient';

export const ordersApi = {
  getCategories: async (branchId = 1) => {
    const response = await axiosClient.get(`/menu/categories?branchId=${branchId}`);
    return response.data;
  },

  getMenuItems: async (branchId = 1, categoryId = null) => {
    let url = `/menu/items?branchId=${branchId}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    const response = await axiosClient.get(url);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await axiosClient.post('/orders', orderData);
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}`);
    return response.data;
  },

  addItemsToOrder: async (orderId, items) => {
    const response = await axiosClient.post(`/orders/${orderId}/items`, items);
    return response.data;
  },

  sendToKitchen: async (orderId) => {
    const response = await axiosClient.post(`/orders/${orderId}/send-to-kitchen`);
    return response.data;
  },

  processPayment: async (orderId, paymentData) => {
    const response = await axiosClient.post(`/orders/${orderId}/payments`, paymentData);
    return response.data;
  },

  getInvoice: async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}/invoice`);
    return response.data;
  },

  getOrders: async () => {
    const response = await axiosClient.get('/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axiosClient.put(`/orders/${orderId}/status?status=${status}`);
    return response.data;
  },

  getPromotionByCode: async (code) => {
    const response = await axiosClient.get(`/promotions/${code}`);
    return response.data;
  },

  applyPromotion: async (orderId, code) => {
    const response = await axiosClient.post(`/orders/${orderId}/apply-promotion?code=${code}`);
    return response.data;
  },

  removePromotion: async (orderId) => {
    const response = await axiosClient.delete(`/orders/${orderId}/promotion`);
    return response.data;
  }
};
