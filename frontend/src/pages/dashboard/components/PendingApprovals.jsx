import React, { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const PendingApprovals = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only Admin and Owner can approve
  if (user?.role !== 'ADMIN' && user?.role !== 'OWNER') return null;

  const fetchPendingUsers = async () => {
    try {
      const res = await axiosClient.get('/users/pending');
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch pending users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosClient.put(`/users/${id}/approve`);
      setPendingUsers(pendingUsers.filter(u => u.id !== id));
      alert("User approved successfully!");
    } catch (err) {
      console.error("Failed to approve user", err);
      alert("Failed to approve user.");
    }
  };

  if (loading || pendingUsers.length === 0) return null;

  return (
    <div className="mt-8 bg-[#11161d] border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-lg font-extrabold text-white flex items-center space-x-2 mb-4">
          <UserPlus className="w-5 h-5 text-amber-400" />
          <span>Pending Role Approvals</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          The following users have registered and are waiting for Super Admin approval to access system actions.
        </p>

        <div className="space-y-3">
          {pendingUsers.map(u => (
            <div key={u.id} className="flex justify-between items-center bg-[#0b0f16] border border-slate-800 p-4 rounded-2xl">
              <div>
                <div className="font-bold text-sm text-slate-200">{u.name}</div>
                <div className="text-xs text-slate-500">{u.email} • Requested Role: <span className="text-amber-400 font-bold">{u.role?.name || 'Unknown'}</span></div>
              </div>
              <button 
                onClick={() => handleApprove(u.id)}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 flex items-center gap-2 transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Role</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
