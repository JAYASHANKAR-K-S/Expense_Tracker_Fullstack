import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { FiPlus, FiCreditCard, FiDollarSign, FiSmartphone, FiTrash2, FiBriefcase } from 'react-icons/fi';

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Cash',
        balance: ''
    });

    const walletTypes = [
        { id: 'Cash', label: 'Cash', icon: <FiDollarSign size={24} /> },
        { id: 'Bank', label: 'Bank Account', icon: <FiBriefcase size={24} /> },
        { id: 'UPI', label: 'UPI Wallet', icon: <FiSmartphone size={24} /> },
        { id: 'Card', label: 'Credit Card', icon: <FiCreditCard size={24} /> },
    ];

    // Fetch Wallets
    const fetchWallets = async () => {
        try {
            const res = await axiosInstance.get('/api/wallets/');
            setWallets(res.data);
        } catch (err) {
            console.error("Failed to fetch wallets", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    // Format Currency
    const formatRupee = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Add Wallet
    const handleAddWallet = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/wallets/', formData);
            setFormData({ name: '', type: 'Cash', balance: '' });
            setIsModalOpen(false);
            fetchWallets(); // Refresh list
        } catch (err) {
            console.error("Failed to add wallet", err);
            alert("Failed to add wallet. Please try again.");
        }
    };

    // Delete Wallet
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this wallet?')) {
            try {
                await axiosInstance.delete(`/api/wallets/${id}/`);
                setWallets(wallets.filter(w => w.id !== id));
            } catch (err) {
                console.error("Failed to delete wallet", err);
            }
        }
    };

    // Helper for Gradient background based on type
    const getGradient = (type) => {
        switch (type) {
            case 'Bank': return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
            case 'UPI': return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            case 'Card': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
            case 'Cash': default: return 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)';
        }
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>My Wallets</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your sources of funds.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <FiPlus /> Add Wallet
                </button>
            </div>

            {/* Wallet Grid */}
            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading wallets...</div>
            ) : wallets.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {wallets.map(wallet => (
                        <div key={wallet.id} className="card" style={{
                            background: getGradient(wallet.type),
                            color: 'white',
                            position: 'relative',
                            border: 'none',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '180px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                                    {walletTypes.find(t => t.id === wallet.type)?.icon || <FiBriefcase size={24} />}
                                </div>
                                <button
                                    onClick={() => handleDelete(wallet.id)}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '4px' }}>{wallet.type}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px' }}>{wallet.name}</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{formatRupee(wallet.balance)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ background: '#F1F5F9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <FiBriefcase size={32} color="#94A3B8" />
                    </div>
                    <h3>No wallets found</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Add your first wallet to start tracking expenses.</p>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Create Wallet</button>
                </div>
            )}

            {/* Add Wallet Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{
                        width: '100%', maxWidth: '480px', padding: '0',
                        borderRadius: '16px', overflow: 'hidden',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Add New Wallet</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddWallet} style={{ padding: '24px' }}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>
                                    Wallet Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. HDFC Salary Acct"
                                    className="styled-input"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>
                                    Wallet Type
                                </label>
                                <select
                                    className="styled-select"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white' }}
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {walletTypes.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>
                                    Initial Balance
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                        color: '#64748B', fontWeight: 'bold'
                                    }}>₹</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="styled-input"
                                        style={{ width: '100%', padding: '12px 12px 12px 32px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                                        value={formData.balance}
                                        onChange={e => setFormData({ ...formData, balance: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer' }}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#4F46E5', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                >
                                    Create Wallet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallets;
