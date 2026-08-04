import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { TableLayoutPage } from '../pages/tables/TableLayoutPage';
import { PosTerminalPage } from '../pages/pos/PosTerminalPage';
import { KdsPage } from '../pages/kds/KdsPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { CustomerOrderPage } from '../pages/customer/CustomerOrderPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/order" element={<CustomerOrderPage />} />
      <Route path="/menu" element={<CustomerOrderPage />} />

      {/* Protected Routes for Authenticated Staff */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tables" element={<TableLayoutPage />} />
        <Route path="/pos" element={<PosTerminalPage />} />
        <Route path="/kds" element={<KdsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Route>

      <Route path="/unauthorized" element={
        <div className="min-h-screen bg-[#0d1217] flex flex-col items-center justify-center text-white p-4 font-sans">
          <h1 className="text-3xl font-extrabold text-rose-500 mb-2">403 - Access Denied</h1>
          <p className="text-slate-400 mb-6 text-sm">You do not have required role permissions to view this module.</p>
          <a href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 rounded-2xl text-xs font-extrabold shadow-lg shadow-orange-500/25">Return to Dashboard</a>
        </div>
      } />

      <Route path="*" element={<Navigate to="/order" replace />} />
    </Routes>
  );
};
