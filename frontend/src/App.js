import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import Layout from './components/Layout';
import Wallets from './pages/Wallets';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import CashFlow from './pages/CashFlow';
import Goals from './pages/Goals';

import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes Application Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/wallets" element={<Wallets />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/cash-flow" element={<CashFlow />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
