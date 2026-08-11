import axiosClient from './axiosClient';

export const adminApi = {
  getAllUsers: () => axiosClient.get('/admin/users').catch(() => axiosClient.get('/users')),
  getPendingUsers: () => axiosClient.get('/admin/users/pending').catch(() => axiosClient.get('/users/pending')),
  createUser: (userData) => axiosClient.post('/admin/users', userData),
  updateUserStatus: (userId, status) => 
    axiosClient.put(`/admin/users/${userId}/status?status=${status}`).catch(() => axiosClient.put(`/users/${userId}/approve`)),
  updateUserRole: (userId, role) =>
    axiosClient.put(`/admin/users/${userId}/role?role=${role}`),
  deleteUser: (userId) =>
    axiosClient.delete(`/admin/users/${userId}`)
};
