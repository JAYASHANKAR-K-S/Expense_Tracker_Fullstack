import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiPlusCircle,
    FiCreditCard,
    FiList,
    FiPieChart,
    FiActivity,
    FiTarget,
    FiLogOut,
    FiTrendingUp
} from 'react-icons/fi';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <FiTrendingUp size={28} />
                <span>FinTrack.</span>
            </div>

            <ul className="sidebar-menu">
                <li className="sidebar-item">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiHome size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/add-expense" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiPlusCircle size={20} />
                        <span>Add Expense</span>
                    </NavLink>
                </li>

                <li className="sidebar-item">
                    <NavLink to="/wallets" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiCreditCard size={20} />
                        <span>Wallets</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiList size={20} />
                        <span>Transactions</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiPieChart size={20} />
                        <span>Reports</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/cash-flow" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiActivity size={20} />
                        <span>Cash Flow</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/goals" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FiTarget size={20} />
                        <span>Goals</span>
                    </NavLink>
                </li>
            </ul>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="btn-logout" style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                }}>
                    <FiLogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
