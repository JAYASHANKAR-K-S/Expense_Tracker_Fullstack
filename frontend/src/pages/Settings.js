import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { FiSettings, FiDollarSign, FiLock, FiGlobe, FiSave, FiLogOut } from 'react-icons/fi';

const Settings = () => {
    const [settings, setSettings] = useState({
        monthly_budget: '',
        currency: 'INR',
        theme: 'light'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axiosInstance.get('/api/profile/');
                const data = res.data;
                setSettings({
                    monthly_budget: data.profile?.monthly_budget || '50000',
                    currency: data.profile?.currency || 'INR',
                    theme: 'light'
                });
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            await axiosInstance.put('/api/profile/', {
                monthly_budget: settings.monthly_budget
            });
            alert("Settings updated!");
        } catch (err) {
            console.error("Failed to save settings", err);
            alert("Failed to save settings");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container">
            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
                {/* Sidebar Navigation (Visual Only for now) */}
                <div className="card" style={{ padding: '0', height: 'fit-content' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', fontWeight: 'bold' }}>Settings</div>
                    <div style={{ padding: '8px' }}>
                        <div style={{ padding: '12px', background: '#EFF6FF', color: '#2563EB', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiSettings /> General
                        </div>
                        <div style={{ padding: '12px', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiLock /> Security
                        </div>
                        <div style={{ padding: '12px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleLogout}>
                            <FiLogOut /> Logout
                        </div>
                    </div>
                </div>

                {/* Main Settings Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Budget Settings */}
                    <div className="card">
                        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FiDollarSign /> Budget Settings</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Manage your monthly spending limits.</p>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Monthly Budget Limit (₹)</label>
                            <input
                                type="number"
                                className="styled-input"
                                style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
                                value={settings.monthly_budget}
                                onChange={(e) => setSettings({ ...settings, monthly_budget: e.target.value })}
                            />
                            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '8px' }}>We will alert you when you cross 80% of this limit.</p>
                        </div>

                        <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiSave /> Update Budget
                        </button>
                    </div>

                    {/* Regional Settings */}
                    <div className="card">
                        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FiGlobe /> Regional Preferences</h3>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Currency</label>
                            <select className="styled-select" style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }} disabled>
                                <option>Indian Rupee (₹)</option>
                            </select>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '8px' }}>Currency is currently locked to your region.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
