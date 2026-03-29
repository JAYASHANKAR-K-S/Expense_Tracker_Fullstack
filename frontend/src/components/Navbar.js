import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">ExpenseTracker</Link>
                <div className="nav-links">
                    {token ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/add-expense">Add Expense</Link>
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
