import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';

// Pages Import
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeamTree from './pages/TeamTree';
import Transactions from './pages/Transactions';
import KycSubmit from './pages/KycSubmit';
import MyProfile from './pages/MyProfile';

// Components Import
import DashboardLayout from './components/DashboardLayout';

// New Admin Pages Import
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminKyc from './pages/admin/AdminKyc';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminSettings from './pages/admin/AdminSettings';

// Route Guards
const PrivateRoute = ({ children }) => {
  const token = Cookies.get('token') || localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  if (user.role === 'admin') return children;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submit-kyc" element={<PrivateRoute><KycSubmit /></PrivateRoute>} />

        <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* User Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/profile" element={<MyProfile />} />
          <Route path="dashboard/tree" element={<TeamTree />} />
          <Route path="dashboard/transactions" element={<Transactions />} />

          {/* New Modular Admin Routes */}
          <Route path="admin" element={<AdminRoute><Outlet /></AdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;