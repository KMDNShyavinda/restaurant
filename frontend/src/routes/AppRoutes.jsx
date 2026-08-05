import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { TableLayoutPage } from '../pages/tables/TableLayoutPage';
import { PosTerminalPage } from '../pages/pos/PosTerminalPage';
import { KdsPage } from '../pages/kds/KdsPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { CustomerOrderPage } from '../pages/customer/CustomerOrderPage';
import { OrderTrackingPage } from '../pages/customer/OrderTrackingPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';
import { RestaurantHomePage } from '../pages/public/RestaurantHomePage';
import { RoleWelcomePage } from '../pages/auth/RoleWelcomePage';
import { WaiterDashboardPage } from '../pages/dashboard/WaiterDashboardPage';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Web Application Routes */}
      <Route path="/" element={<RestaurantHomePage />} />
      <Route path="/home" element={<RestaurantHomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'WAITSTAFF']} />}>
        <Route path="/order" element={<CustomerOrderPage />} />
        <Route path="/menu" element={<CustomerOrderPage />} />
        <Route path="/track" element={<OrderTrackingPage />} />
        <Route path="/track/:orderId" element={<OrderTrackingPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route path="/customer/profile" element={<CustomerProfilePage />} />
      </Route>

      {/* Protected Routes with Role-Based Permission Control */}
      <Route element={<ProtectedRoute />}>
        <Route path="/welcome" element={<RoleWelcomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'OWNER']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'WAITER', 'WAITSTAFF', 'CASHIER']} />}>
        <Route path="/tables" element={<TableLayoutPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'WAITER', 'WAITSTAFF']} />}>
        <Route path="/waiter" element={<WaiterDashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'WAITSTAFF']} />}>
        <Route path="/pos" element={<PosTerminalPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'KITCHEN', 'KITCHEN_STAFF']} />}>
        <Route path="/kds" element={<KdsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'MANAGER', 'KITCHEN', 'KITCHEN_STAFF']} />}>
        <Route path="/inventory" element={<InventoryPage />} />
      </Route>

      <Route path="/unauthorized" element={
        <div className="min-h-screen bg-[#07090c] flex flex-col items-center justify-center text-white p-4 font-sans selection:bg-amber-500">
          <div className="bg-[#11161d] border border-rose-500/30 p-8 rounded-3xl max-w-md text-center shadow-2xl space-y-4">
            <h1 className="text-3xl font-extrabold text-rose-400 mb-1">403 - Access Restricted</h1>
            <p className="text-slate-400 text-xs">Your account role does not have permission to access this workstation module.</p>
            <a href="/welcome" className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-2xl text-xs font-extrabold text-white shadow-lg shadow-amber-500/25 uppercase tracking-wider">
              Return to Role Launchpad
            </a>
          </div>
        </div>
      } />

      <Route path="*" element={<Navigate to="/order" replace />} />
    </Routes>
  );
};
