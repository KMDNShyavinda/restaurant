import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { TableLayoutPage } from '../pages/tables/TableLayoutPage';
import { PosTerminalPage } from '../pages/pos/PosTerminalPage';
import { KdsPage } from '../pages/kds/KdsPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { CustomerOrderPage } from '../pages/customer/CustomerOrderPage';
import { RestaurantHomePage } from '../pages/public/RestaurantHomePage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Web Application Routes */}
      <Route path="/" element={<RestaurantHomePage />} />
      <Route path="/home" element={<RestaurantHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/order" element={<CustomerOrderPage />} />
      <Route path="/menu" element={<CustomerOrderPage />} />

      {/* Protected Routes with Role-Based Permission Control */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'WAITER']} />}>
        <Route path="/tables" element={<TableLayoutPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'WAITER']} />}>
        <Route path="/pos" element={<PosTerminalPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'KITCHEN']} />}>
        <Route path="/kds" element={<KdsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'KITCHEN']} />}>
        <Route path="/inventory" element={<InventoryPage />} />
      </Route>

      <Route path="/unauthorized" element={
        <div className="min-h-screen bg-[#0d1217] flex flex-col items-center justify-center text-white p-4 font-sans">
          <h1 className="text-3xl font-extrabold text-rose-500 mb-2">403 - Access Denied</h1>
          <p className="text-slate-400 mb-6 text-sm">Your account role does not have permission to access this module.</p>
          <a href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 rounded-2xl text-xs font-extrabold shadow-lg shadow-orange-500/25">Return to Overview Dashboard</a>
        </div>
      } />

      <Route path="*" element={<Navigate to="/order" replace />} />
    </Routes>
  );
};
