import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    FiUser,
    FiChevronDown,
    FiCalendar,
    FiTag,
    FiFileText,
    FiLayers,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi';

const DEFAULT_CATEGORIES = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Rent' },
    { id: 3, name: 'Travel' },
    { id: 4, name: 'Shopping' },
    { id: 5, name: 'Bills' },
    { id: 6, name: 'Entertainment' },
    { id: 7, name: 'Health' },
    { id: 8, name: 'Education' },
    { id: 9, name: 'Other' }
];

const AddExpense = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI'); // Cash, UPI, Card

    const initialFormState = {
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialFormState);

    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState('');

    const isFormValid = formData.amount && formData.category && formData.date && paymentMethod;

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axiosInstance.get('/api/categories/');
                // Merge API categories with Defaults (Unique by Name)
                const apiCats = res.data || [];
                const merged = [...DEFAULT_CATEGORIES];

                apiCats.forEach(apiCat => {
                    // If API cat is not in default, add it
                    if (!merged.find(d => d.name.toLowerCase() === apiCat.name.toLowerCase())) {
                        merged.push(apiCat);
                    }
                });

                setCategories(merged);
            } catch (err) {
                console.error('Failed to fetch categories, using defaults', err);
                setCategories(DEFAULT_CATEGORIES);
            }
        };
        fetchCats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isFormValid) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            // Fix: Do NOT send 'category' field directly, as it contains a Name string,
            // but the backend expects an ID for that field.
            // We only send 'category_input' with the name.
            const payload = {
                amount: formData.amount,
                description: formData.description,
                date: formData.date,
                category_input: formData.category, // Send name here
                payment_method: paymentMethod
            };

            await axiosInstance.post('/api/expenses/', payload);

            // Show Success UI
            setShowToast(true);

            // Clear form
            setFormData(initialFormState);

            setTimeout(() => {
                navigate('/transactions');
            }, 1500);

        } catch (err) {
            console.error(err);
            setError('Failed to save expense. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="split-layout">
                {/* LEFT: Form */}
                <div className="form-container" style={{ background: 'var(--card-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}>
                    <div className="form-title">
                        <span style={{ width: '40px', height: '40px', background: 'var(--bg-deep)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <FiLayers />
                        </span>
                        New Transaction
                    </div>

                    <form className="form-grid" onSubmit={handleSubmit}>
                        {/* Amount & Date Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="input-wrapper">
                                {/* Fixed: Indian Rupee Symbol */}
                                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: '600', paddingLeft: '4px' }}>₹</span>
                                <input
                                    type="number"
                                    className="styled-input"
                                    placeholder="1,500" // Adjusted placeholder
                                    required
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    style={{ paddingLeft: '8px' }} // Adjustment for the prefix
                                />
                            </div>
                            <div className="input-wrapper">
                                <FiCalendar size={18} />
                                <input
                                    type="date"
                                    className="styled-input"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    style={{ color: 'var(--text-main)' }}
                                />
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div className="input-wrapper">
                            <FiTag size={18} />
                            <select
                                className="styled-input styled-select"
                                required
                                value={formData.category} // Now stores the NAME
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ color: 'var(--text-main)' }}
                            >
                                <option value="">Choose a category</option>
                                {categories.map((cat, index) => (
                                    // Fallback: if cat has no ID (unlikely), use index. Use Name as value.
                                    <option key={cat.id || index} value={cat.name} style={{ color: '#000' }}>{cat.name}</option>
                                ))}
                            </select>
                            <FiChevronDown style={{ left: 'auto', right: '16px' }} />
                        </div>
                        {categories.length === 0 && (
                            <small style={{ color: '#EF4444', marginTop: '-8px', display: 'block' }}>Could not load categories</small>
                        )}

                        {/* Payment Method */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Payment Method</label>
                            <div className="payment-methods">
                                <div
                                    className={`method-btn ${paymentMethod === 'Cash' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('Cash')}
                                >
                                    Cash
                                </div>
                                <div
                                    className={`method-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('UPI')}
                                >
                                    UPI
                                </div>
                                <div
                                    className={`method-btn ${paymentMethod === 'Card' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('Card')}
                                >
                                    Card
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="input-wrapper">
                            <FiFileText size={18} />
                            <input
                                type="text"
                                className="styled-input"
                                placeholder="Description (e.g. Dinner at Taj)"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {error && (
                            <div style={{ color: '#EF4444', fontSize: '0.9rem', marginTop: '8px' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading || !isFormValid}
                            style={{
                                justifyContent: 'center',
                                marginTop: '16px',
                                opacity: (!isFormValid || isLoading) ? 0.6 : 1,
                                cursor: (!isFormValid || isLoading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Saving...' : 'Save Expense'}
                        </button>
                    </form>
                </div>

                {/* RIGHT: Context */}
                <div className="context-sidebar">
                    <div className="glance-card" style={{ background: 'var(--card-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}>
                        <h4 style={{ color: 'var(--text-secondary)' }}>Spending at a Glance</h4>
                        <div className="mini-list">
                            <div className="mini-item" style={{ borderColor: 'var(--glass-border)' }}>
                                <span>Today</span>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹1,240</span> {/* Format updated manually to match style if not dynamic */}
                            </div>
                            <div className="mini-item" style={{ borderColor: 'var(--glass-border)' }}>
                                <span>This Week</span>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹8,450</span>
                            </div>
                            <div className="mini-item" style={{ borderColor: 'var(--glass-border)' }}>
                                <span>Avg. Daily</span>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹2,100</span>
                            </div>
                        </div>
                    </div>

                    <div className="glance-card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                            <FiAlertCircle color="#10B981" size={24} />
                            <div>
                                <h5 style={{ margin: '0 0 4px 0', color: '#10B981' }}>Smart Tip</h5>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#D1FAE5' }}>
                                    Track your expenses daily to improve savings by up to 20% this month.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
