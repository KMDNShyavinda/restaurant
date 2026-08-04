import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { TableLayoutPage } from '../pages/tables/TableLayoutPage';
import { PosTerminalPage } from '../pages/pos/PosTerminalPage';
import { KdsPage } from '../pages/kds/KdsPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes for Authenticated Staff */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tables" element={<TableLayoutPage />} />
        <Route path="/pos" element={<PosTerminalPage />} />
        <Route path="/kds" element={<KdsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Route>

      <Route path="/unauthorized" element={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-3xl font-bold text-rose-500 mb-2">403 - Access Denied</h1>
          <p className="text-slate-400 mb-4">You do not have required role permissions to view this module.</p>
          <a href="/dashboard" className="px-4 py-2 bg-sky-600 rounded-xl text-sm font-semibold">Return to Dashboard</a>
        </div>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
