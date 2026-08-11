import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { 
  Users, Check, X, Search, ShieldAlert,
  AlertCircle, ShieldCheck, UserPlus, Filter,
  Trash2, Edit3, Lock, RefreshCw, ChevronRight, UserCheck
} from 'lucide-react';

export const AdminUsersPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roleName: 'CASHIER'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allRes, pendingRes] = await Promise.allSettled([
        adminApi.getAllUsers(),
        adminApi.getPendingUsers()
      ]);

      if (allRes.status === 'fulfilled' && Array.isArray(allRes.value.data)) {
        setUsers(allRes.value.data);
      } else {
        setUsers([]);
      }

      if (pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value.data)) {
        setPendingUsers(pendingRes.value.data);
      } else {
        setPendingUsers([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load user management data.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract role name safely from string or object
  const getRoleName = (userRole) => {
    if (!userRole) return 'USER';
    if (typeof userRole === 'string') return userRole.toUpperCase();
    if (typeof userRole === 'object' && userRole.name) return userRole.name.toUpperCase();
    return 'USER';
  };

  // Status handler
  const handleStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminApi.updateUserStatus(userId, nextStatus);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  // Approve pending user
  const handleApprove = async (id) => {
    try {
      await adminApi.updateUserStatus(id, 'ACTIVE');
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      // Refresh all users
      const res = await adminApi.getAllUsers();
      if (Array.isArray(res.data)) setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to approve user.');
    }
  };

  // Reject pending user
  const handleReject = async (id) => {
    try {
      await adminApi.updateUserStatus(id, 'REJECTED');
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'REJECTED' } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to reject user.');
    }
  };

  // Open role edit modal
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(getRoleName(user.role));
    setShowRoleModal(true);
  };

  // Submit role update
  const handleUpdateRoleSubmit = async () => {
    if (!selectedUser || !newRole) return;
    try {
      const res = await adminApi.updateUserRole(selectedUser.id, newRole);
      setShowRoleModal(false);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? (res.data || { ...u, role: newRole }) : u));
    } catch (err) {
      console.error(err);
      alert('Failed to update role.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user.');
    }
  };

  // Create new user form submit
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    try {
      const res = await adminApi.createUser(newUserForm);
      setShowAddModal(false);
      setNewUserForm({ name: '', email: '', password: '', phone: '', roleName: 'CASHIER' });
      // Add new user to list
      if (res.data) {
        setUsers(prev => [res.data, ...prev]);
      } else {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create user. Email may already exist.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filtered users for "All Users" tab
  const filteredUsers = users.filter(u => {
    const nameMatch = u.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = u.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || emailMatch || phoneMatch;

    const uRole = getRoleName(u.role);
    const matchesRole = roleFilter === 'ALL' || uRole === roleFilter;

    const uStatus = (u.status || 'ACTIVE').toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || uStatus === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeStyle = (userRole) => {
    const r = getRoleName(userRole);
    switch (r) {
      case 'ADMIN':
      case 'OWNER':
      case 'SUPER_ADMIN':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MANAGER':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'CASHIER':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'WAITER':
      case 'WAITSTAFF':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'KITCHEN':
      case 'KITCHEN_STAFF':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadgeStyle = (status) => {
    const s = (status || 'ACTIVE').toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'PENDING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse';
      case 'INACTIVE':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 font-sans p-4 md:p-10 selection:bg-amber-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11161d] border border-slate-800/80 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="w-12 h-12 rounded-2xl bg-[#0b0f16] hover:bg-slate-800 flex items-center justify-center border border-slate-800 transition cursor-pointer text-slate-400 hover:text-white"
            >
              <span className="text-xl">←</span>
            </button>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Staff & User Management</h1>
              <p className="text-xs md:text-sm text-slate-400">Oversee system credentials, role permissions & pending approvals</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              className="px-4 py-2.5 rounded-2xl bg-[#0b0f16] hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-extrabold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800/80 gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'all' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All System Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'pending' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pending Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="bg-amber-500 text-black text-[11px] font-black px-2 py-0.5 rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-[#11161d] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* TAB 1: ALL USERS */}
          {activeTab === 'all' && (
            <div>
              {/* Search & Filter Bar */}
              <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d1219]">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#07090c] border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Role:</span>
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-[#07090c] border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin / Owner</option>
                    <option value="MANAGER">Manager</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="WAITER">Waiter</option>
                    <option value="KITCHEN">Kitchen Staff</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>

                  <div className="flex items-center gap-2 text-xs text-slate-400 ml-2">
                    <span>Status:</span>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#07090c] border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="p-0">
                {loading ? (
                  <div className="p-16 text-center text-slate-500 space-y-3">
                    <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-500/50" />
                    <p>Loading user database...</p>
                  </div>
                ) : error ? (
                  <div className="p-16 text-center text-rose-500 flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8" />
                    <p>{error}</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
                    <Users className="w-12 h-12 text-slate-700" />
                    <p className="font-semibold text-lg text-slate-300">No users found</p>
                    <p className="text-xs">Try clearing search filters or add a new user.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#0b0f16] text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4">User Details</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Contact Phone</th>
                          <th className="px-6 py-4 text-right">Manage Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {filteredUsers.map(u => {
                          const uRole = getRoleName(u.role);
                          const uStatus = (u.status || 'ACTIVE').toUpperCase();
                          return (
                            <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
                                    {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white text-sm">{u.name || 'Unnamed User'}</div>
                                    <div className="text-slate-500 text-xs">{u.email}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`py-1 px-3 rounded-xl text-xs font-extrabold border ${getRoleBadgeStyle(u.role)}`}>
                                  {uRole}
                                </span>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`py-1 px-3 rounded-xl text-xs font-bold border ${getStatusBadgeStyle(u.status)}`}>
                                  {uStatus}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-slate-400 text-xs">
                                {u.phone || '-'}
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openRoleModal(u)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                                    title="Edit Role"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Role</span>
                                  </button>

                                  <button
                                    onClick={() => handleStatusToggle(u.id, uStatus)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                      uStatus === 'ACTIVE' 
                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                    }`}
                                    title="Toggle Status"
                                  >
                                    {uStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                    className="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 flex items-center justify-center transition cursor-pointer"
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PENDING APPROVALS */}
          {activeTab === 'pending' && (
            <div className="p-6">
              {loading ? (
                <div className="p-16 text-center text-slate-500 space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-500/50" />
                  <p>Loading pending requests...</p>
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <ShieldCheck className="w-16 h-16 text-emerald-500/40" />
                  <p className="font-extrabold text-xl text-white">No Pending Approvals</p>
                  <p className="text-sm max-w-sm text-center text-slate-400">All registered staff members have been verified and approved.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl">
                    ⚠️ The following staff accounts registered recently and require Admin clearance to access POS workstation endpoints.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingUsers.map(u => {
                      const uRole = getRoleName(u.role);
                      return (
                        <div key={u.id} className="bg-[#0b0f16] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition shadow-lg">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-black text-white text-base">{u.name || 'New Staff Member'}</h3>
                              <p className="text-xs text-slate-400">{u.email}</p>
                              <p className="text-xs text-slate-500">Phone: {u.phone || 'N/A'}</p>
                            </div>
                            <span className={`py-1 px-3 rounded-xl text-xs font-extrabold border ${getRoleBadgeStyle(u.role)}`}>
                              Requested: {uRole}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                            <button
                              onClick={() => handleReject(u.id)}
                              className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-extrabold border border-rose-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject Request</span>
                            </button>

                            <button
                              onClick={() => handleApprove(u.id)}
                              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve & Activate</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* MODAL: Edit User Role */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11161d] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <span>Modify User Role</span>
              </h2>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#0b0f16] p-3 rounded-2xl border border-slate-800">
                <div className="font-bold text-white text-sm">{selectedUser.name}</div>
                <div className="text-slate-400">{selectedUser.email}</div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Select New System Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#07090c] border border-slate-800 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ADMIN">ADMIN (Full Access)</option>
                  <option value="MANAGER">MANAGER (Operations & Reports)</option>
                  <option value="CASHIER">CASHIER (POS & Billing)</option>
                  <option value="WAITER">WAITER (Table Orders)</option>
                  <option value="KITCHEN">KITCHEN (Kitchen Display System)</option>
                  <option value="CUSTOMER">CUSTOMER (Mobile Dining App)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRoleSubmit}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11161d] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-500" />
                <span>Create New Staff Account</span>
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full bg-[#07090c] border border-slate-800 rounded-2xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="staff@restaurant.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-[#07090c] border border-slate-800 rounded-2xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full bg-[#07090c] border border-slate-800 rounded-2xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0771234567"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full bg-[#07090c] border border-slate-800 rounded-2xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Assign Workstation Role</label>
                <select
                  value={newUserForm.roleName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, roleName: e.target.value })}
                  className="w-full bg-[#07090c] border border-slate-800 rounded-2xl p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ADMIN">ADMIN (Full Control)</option>
                  <option value="MANAGER">MANAGER (Branch Operations)</option>
                  <option value="CASHIER">CASHIER (POS Billing Terminal)</option>
                  <option value="WAITER">WAITER (Table Floor App)</option>
                  <option value="KITCHEN">KITCHEN (Kitchen Display System)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
