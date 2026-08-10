import axiosClient from './axiosClient';

export const tablesApi = {
  getTables: async (branchId = 1) => {
    const response = await axiosClient.get(`/tables?branchId=${branchId}`);
    return response.data;
  },

  updateTableStatus: async (id, status) => {
    const response = await axiosClient.patch(`/tables/${id}/status?status=${status}`);
    return response.data;
  },

  updateTablePosition: async (id, x, y) => {
    const response = await axiosClient.patch(`/tables/${id}/position?x=${x}&y=${y}`);
    return response.data;
  },

  createTable: async (tableData) => {
    const response = await axiosClient.post('/tables', tableData);
    return response.data;
  },

  getReservations: async (branchId = 1) => {
    const response = await axiosClient.get(`/reservations?branchId=${branchId}`);
    return response.data;
  },

  createReservation: async (reservationData) => {
    const response = await axiosClient.post('/reservations', reservationData);
    return response.data;
  },
};
