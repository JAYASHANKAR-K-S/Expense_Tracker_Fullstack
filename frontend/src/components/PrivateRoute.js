import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('access_token');
    // Simple check: if token exists, render child routes (Outlet)
    // If not, redirect to login
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
