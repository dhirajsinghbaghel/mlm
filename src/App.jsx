import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Pages Import
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeamTree from './pages/TeamTree'; // Jo TreeComponent.jsx hai
import Transactions from './pages/Transactions';
import AdminPanel from './pages/AdminPanel';
import { ToastContainer } from 'react-toastify';
import KycSubmit from './pages/KycSubmit';
import MyProfile from './pages/MyProfile';

// Components Import
import DashboardLayout from './components/DashboardLayout';

// Private Route Component (Login Check)
const PrivateRoute = ({ children }) => {
  const token = Cookies.get('token') || localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Admin Route Component (Role Check)
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  if (user.role === 'admin') {
    return children;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submit-kyc" element={<PrivateRoute><KycSubmit /></PrivateRoute>} />

        {/* Protected Dashboard Routes Wrapped in DashboardLayout */}
        <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>

          {/* Default redirect from / to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* User Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/profile" element={<MyProfile />} />
          <Route path="dashboard/tree" element={<TeamTree />} />
          <Route path="dashboard/transactions" element={<Transactions />} />

          {/* Admin Routes */}
          <Route path="admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />

        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;