import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiFilter, FiTrash2, FiEdit2, FiSearch, FiDownload, FiTruck, FiCoffee, FiShoppingBag, FiHome } from 'react-icons/fi';

const Transactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch Transactions
    const fetchTransactions = async () => {
        try {
            const res = await axiosInstance.get('/api/expenses/');
            setTransactions(res.data);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Delete Transaction
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axiosInstance.delete(`/api/expenses/${id}/`);
                // Optimistic update
                setTransactions(transactions.filter(t => t.id !== id));
            } catch (err) {
                console.error("Failed to delete transaction", err);
                alert("Failed to delete. Please try again.");
            }
        }
    };

    // Currency Formatter
    const formatRupee = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Category Icon Helper (Duplicated for now, optimal to move to utils)
    const getCategoryIcon = (catName) => {
        const name = catName?.toLowerCase() || '';
        if (name.includes('food')) return <FiCoffee />;
        if (name.includes('travel') || name.includes('transport')) return <FiTruck />;
        if (name.includes('shop')) return <FiShoppingBag />;
        return <FiHome />;
    };

    // Filter Logic
    const filteredTransactions = transactions.filter(t =>
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Export to CSV
    const handleExport = () => {
        if (!filteredTransactions || filteredTransactions.length === 0) {
            alert("No transactions to export.");
            return;
        }

        const headers = ['Date', 'Category', 'Description', 'Method', 'Amount'];
        const csvRows = [headers.join(',')];

        for (const t of filteredTransactions) {
            const date = t.date || '';
            const category = `"${t.category_name || ''}"`;
            const description = `"${(t.description || '').replace(/"/g, '""')}"`;
            const method = t.payment_method || 'Cash';
            const amount = t.amount || 0;
            
            csvRows.push([date, category, description, method, amount].join(','));
        }

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="dashboard-container">
            <div className="card">
                {/* Header & Actions */}
                <div className="table-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>All Transactions</h2>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {transactions.length} total transactions
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className="search-box" style={{ position: 'relative' }}>
                            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="styled-input"
                                style={{ paddingLeft: '36px', height: '40px', width: '200px' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiFilter /> Filter
                        </button>
                        <button className="btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiDownload /> Export
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Loading transactions...
                    </div>
                ) : filteredTransactions.length > 0 ? (
                    <div className="table-responsive">
                        <table className="styled-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left' }}>
                                    <th style={{ padding: '16px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem' }}>DATE</th>
                                    <th style={{ padding: '16px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem' }}>CATEGORY</th>
                                    <th style={{ padding: '16px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem' }}>DESCRIPTION</th>
                                    <th style={{ padding: '16px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem' }}>METHOD</th>
                                    <th style={{ padding: '16px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem' }}>AMOUNT</th>
                                    <th style={{ padding: '16px', color: '#64748B', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{t.date}</td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    background: '#EEF2FF',
                                                    color: '#4F46E5',
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {getCategoryIcon(t.category_name)}
                                                </span>
                                                <span style={{ fontWeight: '500' }}>{t.category_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{t.description || '-'}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                background: 'var(--glass-surface)',
                                                border: '1px solid var(--glass-border)',
                                                color: 'var(--text-main)',
                                                fontSize: '0.85rem',
                                                fontWeight: '500'
                                            }}>
                                                {t.payment_method || 'Cash'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-main)' }}>
                                            {formatRupee(t.amount)}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                                                    onClick={() => navigate('/add-expense', { state: { expense: t } })}
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                                                    onClick={() => handleDelete(t.id)}
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div style={{ background: '#F8FAFC', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                            <FiShoppingBag size={24} color="#94A3B8" />
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>No transactions yet</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Start by adding a new expense.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
