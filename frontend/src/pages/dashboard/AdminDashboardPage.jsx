import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { 
  Users, Check, X, Search, ShieldAlert,
  AlertCircle, ShieldCheck
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingUsers();
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pending users.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminApi.updateUserStatus(id, 'ACTIVE');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to approve user.');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminApi.updateUserStatus(id, 'REJECTED');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to reject user.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Admin Approvals</h1>
            <p className="text-sm text-slate-400">Review and approve pending staff registrations</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#11161d] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Pending Users
              <span className="bg-amber-500/20 text-amber-400 text-xs py-0.5 px-2.5 rounded-full ml-2 font-black">
                {users.length}
              </span>
            </h2>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-10 text-center text-slate-500">Loading pending requests...</div>
            ) : error ? (
              <div className="p-10 text-center text-rose-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8" />
                <p>{error}</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <ShieldCheck className="w-12 h-12 text-emerald-500/50" />
                <p className="font-semibold text-lg">No pending approvals</p>
                <p className="text-sm">All staff accounts have been reviewed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#0b0f16] text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-2xl">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-slate-500 text-xs">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-800 text-slate-300 py-1 px-3 rounded-xl text-xs font-bold border border-slate-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {user.phone || '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(user.id)}
                              className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center transition cursor-pointer"
                              title="Reject User"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center transition cursor-pointer"
                              title="Approve User"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
