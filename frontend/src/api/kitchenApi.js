import axiosClient from './axiosClient';

export const kitchenApi = {
  getActiveTickets: async (station = null) => {
    let url = '/kitchen/tickets';
    if (station && station !== 'ALL') {
      url += `?station=${station}`;
    }
    const response = await axiosClient.get(url);
    return response.data;
  },

  updateTicketStatus: async (ticketId, status) => {
    const response = await axiosClient.patch(`/kitchen/tickets/${ticketId}/status?status=${status}`);
    return response.data;
  },
};
