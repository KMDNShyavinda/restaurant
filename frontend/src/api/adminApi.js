import axiosClient from './axiosClient';

export const adminApi = {
  getPendingUsers: () => axiosClient.get('/admin/users/pending'),
  updateUserStatus: (userId, status) => 
    axiosClient.put(`/admin/users/${userId}/status?status=${status}`)
};
