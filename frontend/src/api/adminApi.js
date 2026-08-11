import axiosClient from './axiosClient';

export const adminApi = {
  getAllUsers: () => axiosClient.get('/admin/users'),
  getPendingUsers: () => axiosClient.get('/admin/users/pending'),
  createUser: (userData) => axiosClient.post('/admin/users', userData),
  updateUserStatus: (userId, status) => 
    axiosClient.put(`/admin/users/${userId}/status?status=${status}`),
  updateUserRole: (userId, role) =>
    axiosClient.put(`/admin/users/${userId}/role?role=${role}`),
  deleteUser: (userId) =>
    axiosClient.delete(`/admin/users/${userId}`)
};
