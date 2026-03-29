import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { FiPlus, FiTarget, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    // Form States
    const [createForm, setCreateForm] = useState({ name: '', target_amount: '', target_date: '', description: '' });
    const [contributeForm, setContributeForm] = useState({ amount: '' });

    // Fetch Goals
    const fetchGoals = async () => {
        try {
            const res = await axiosInstance.get('/api/goals/');
            setGoals(res.data);
        } catch (err) {
            console.error("Failed to fetch goals", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    // Create Goal
    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/goals/', createForm);
            setCreateForm({ name: '', target_amount: '', target_date: '', description: '' });
            setIsCreateModalOpen(false);
            fetchGoals();
        } catch (err) {
            console.error("Failed to create goal", err);
            alert("Failed to create goal");
        }
    };

    // Add Contribution
    const handleAddContribution = async (e) => {
        e.preventDefault();
        if (!selectedGoal) return;

        const newSavedAmount = parseFloat(selectedGoal.saved_amount) + parseFloat(contributeForm.amount);
        let newStatus = selectedGoal.status;
        if (newSavedAmount >= parseFloat(selectedGoal.target_amount)) {
            newStatus = 'Completed';
        }

        try {
            await axiosInstance.patch(`/api/goals/${selectedGoal.id}/`, {
                saved_amount: newSavedAmount,
                status: newStatus
            });
            setContributeForm({ amount: '' });
            setIsContributeModalOpen(false);
            fetchGoals();
        } catch (err) {
            console.error("Failed to add contribution", err);
            alert("Failed to update goal");
        }
    };

    const openContributeModal = (goal) => {
        setSelectedGoal(goal);
        setIsContributeModalOpen(true);
    };

    const formatRupee = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    // Status Helper
    const getStatusColor = (goal) => {
        if (goal.status === 'Completed') return '#10B981';
        const progress = (goal.saved_amount / goal.target_amount) * 100;
        if (progress > 75) return '#10B981'; // Green
        if (progress > 30) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Financial Goals</h2>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Set targets and track your savings journey.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                    <FiPlus /> Create Goal
                </button>
            </div>

            {/* Goals Grid */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading goals...</div>
            ) : goals.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                    {goals.map(goal => {
                        const progress = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
                        const statusColor = getStatusColor(goal);

                        return (
                            <div key={goal.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>{goal.name}</h3>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>by {new Date(goal.target_date).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{
                                        padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                                        background: goal.status === 'Completed' ? '#D1FAE5' : '#E0E7FF',
                                        color: goal.status === 'Completed' ? '#065F46' : '#3730A3'
                                    }}>
                                        {goal.status}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                                        <span>{formatRupee(goal.saved_amount)}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>of {formatRupee(goal.target_amount)}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${progress}%`, height: '100%', background: statusColor, transition: 'width 0.5s ease' }}></div>
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '0.8rem', textAlign: 'right', color: statusColor }}>
                                        {progress.toFixed(1)}% Completed
                                    </div>
                                </div>

                                <button
                                    className="btn-secondary"
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    onClick={() => openContributeModal(goal)}
                                    disabled={goal.status === 'Completed'}
                                >
                                    <FiTrendingUp /> Add Contribution
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ background: '#F1F5F9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <FiTarget size={32} color="#94A3B8" />
                    </div>
                    <h3>No goals yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Create your first financial goal to start saving.</p>
                    <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>Create Goal</button>
                </div>
            )}

            {/* Create Goal Modal */}
            {isCreateModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Create Goal</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
                        </div>
                        <form onSubmit={handleCreateGoal} style={{ padding: '24px' }}>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Goal Name</label>
                                <input type="text" placeholder="e.g. New Car" className="styled-input" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                    value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Target Amount</label>
                                <input type="number" placeholder="0.00" className="styled-input" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                    value={createForm.target_amount} onChange={e => setCreateForm({ ...createForm, target_amount: e.target.value })} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Target Date</label>
                                <input type="date" className="styled-input" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                    value={createForm.target_date} onChange={e => setCreateForm({ ...createForm, target_date: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px' }}>Create Goal</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Contribute Modal */}
            {isContributeModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Add Contribution</h3>
                            <button onClick={() => setIsContributeModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
                        </div>
                        <form onSubmit={handleAddContribution} style={{ padding: '24px' }}>
                            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Adding to: <strong>{selectedGoal?.name}</strong></p>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Amount to Save</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>₹</span>
                                    <input type="number" placeholder="0.00" className="styled-input" style={{ width: '100%', padding: '12px 12px 12px 32px', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                        value={contributeForm.amount} onChange={e => setContributeForm({ ...contributeForm, amount: e.target.value })} required />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px' }}>Confirm Savings</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
