import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { FiPlus, FiArrowUpCircle, FiArrowDownCircle, FiActivity, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const CashFlow = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // '7', '30', '90', 'all'
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    // Income Form State
    const [incomeForm, setIncomeForm] = useState({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const fetchData = async () => {
        try {
            const [incRes, expRes] = await Promise.all([
                axiosInstance.get('/api/incomes/'),
                axiosInstance.get('/api/expenses/')
            ]);
            setIncomes(incRes.data);
            setExpenses(expRes.data);
        } catch (err) {
            console.error("Failed to fetch cash flow data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddIncome = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/incomes/', incomeForm);
            setIncomeForm({ source: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
            setIsIncomeModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Failed to add income", err);
            alert("Failed to add income");
        }
    };

    // Filter Data
    const { filteredIncomes, filteredExpenses } = useMemo(() => {
        if (dateRange === 'all') return { filteredIncomes: incomes, filteredExpenses: expenses };

        const now = new Date();
        const days = parseInt(dateRange);
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - days);

        return {
            filteredIncomes: incomes.filter(i => new Date(i.date) >= cutoff),
            filteredExpenses: expenses.filter(e => new Date(e.date) >= cutoff)
        };
    }, [incomes, expenses, dateRange]);

    // Stats
    const stats = useMemo(() => {
        const totalIncome = filteredIncomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        const totalExpense = filteredExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        const netFlow = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? ((netFlow / totalIncome) * 100).toFixed(1) : 0;

        return { totalIncome, totalExpense, netFlow, savingsRate };
    }, [filteredIncomes, filteredExpenses]);

    const formatRupee = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    // Chart Data
    const chartData = useMemo(() => {
        // Group by Date (YYYY-MM-DD) or Month depending on range
        // For simplicity, grouping by Date for small ranges, Month for large
        const labels = [];
        const incData = [];
        const expData = [];
        const flowData = [];

        // Combine all unique dates and sort
        const dates = new Set([
            ...filteredIncomes.map(i => i.date),
            ...filteredExpenses.map(e => e.date)
        ]);
        const sortedDates = Array.from(dates).sort();

        sortedDates.forEach(date => {
            const inc = filteredIncomes.filter(i => i.date === date).reduce((a, b) => a + parseFloat(b.amount), 0);
            const exp = filteredExpenses.filter(e => e.date === date).reduce((a, b) => a + parseFloat(b.amount), 0);

            labels.push(date);
            incData.push(inc);
            expData.push(exp);
            flowData.push(inc - exp);
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: incData,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expense',
                    data: expData,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }, [filteredIncomes, filteredExpenses]);

    // Bar Chart Comparison
    const barData = {
        labels: ['Total'],
        datasets: [
            { label: 'Income', data: [stats.totalIncome], backgroundColor: '#10B981', borderRadius: 8 },
            { label: 'Expense', data: [stats.totalExpense], backgroundColor: '#EF4444', borderRadius: 8 }
        ]
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Cash Flow</h2>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Monitor your money in vs money out.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ background: 'white', padding: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex' }}>
                        {['7', '30', '90', 'all'].map(r => (
                            <button
                                key={r}
                                onClick={() => setDateRange(r)}
                                style={{
                                    padding: '6px 12px', border: 'none', background: dateRange === r ? '#EEF2FF' : 'transparent',
                                    color: dateRange === r ? '#4F46E5' : '#64748B', fontWeight: dateRange === r ? '600' : '400',
                                    borderRadius: '6px', cursor: 'pointer', textTransform: 'capitalize'
                                }}
                            >
                                {r === 'all' ? 'All' : `${r}d`}
                            </button>
                        ))}
                    </div>
                    <button className="btn-primary" onClick={() => setIsIncomeModalOpen(true)}>
                        <FiPlus /> Add Income
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-row" style={{ marginBottom: '24px' }}>
                <div className="card stat-card">
                    <div className="label">Total Income</div>
                    <div className="value" style={{ color: '#10B981' }}>{formatRupee(stats.totalIncome)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiArrowUpCircle /> Money In
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="label">Total Expense</div>
                    <div className="value" style={{ color: '#EF4444' }}>{formatRupee(stats.totalExpense)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiArrowDownCircle /> Money Out
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="label">Net Cash Flow</div>
                    <div className="value" style={{ color: stats.netFlow >= 0 ? '#10B981' : '#EF4444' }}>{formatRupee(stats.netFlow)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {stats.netFlow >= 0 ? <FiTrendingUp /> : <FiTrendingDown />} {stats.savingsRate}% saved
                    </div>
                </div>
            </div>

            {/* Charts */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>Loading cash flow...</div>
            ) : filteredIncomes.length === 0 && filteredExpenses.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ background: '#F1F5F9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <FiActivity size={32} color="#94A3B8" />
                    </div>
                    <h3>No cash flow data yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Start by adding income and expenses to see your trends.</p>
                    <button className="btn-primary" onClick={() => setIsIncomeModalOpen(true)} style={{ marginTop: '16px' }}>Add First Income</button>
                </div>
            ) : (
                <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    <div style={{ background: 'rgba(28, 19, 53, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '32px' }}>
                        <div className="chart-header"><div className="chart-title">Income vs Expense Trend</div></div>
                        <div style={{ height: '300px' }}>
                            <Line data={chartData} options={{
                                maintainAspectRatio: false,
                                scales: {
                                    x: { grid: { display: false }, ticks: { color: '#A0A0C0' } },
                                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A0A0C0' } }
                                },
                                plugins: { legend: { labels: { color: '#fff' } } }
                            }} />
                        </div>
                    </div>
                    <div style={{ background: 'rgba(28, 19, 53, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '32px' }}>
                        <div className="chart-header"><div className="chart-title">Net Comparison</div></div>
                        <div style={{ height: '300px' }}>
                            <Bar data={barData} options={{
                                maintainAspectRatio: false,
                                scales: {
                                    x: { ticks: { color: '#A0A0C0' }, grid: { display: false } },
                                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A0A0C0' } }
                                },
                                plugins: { legend: { labels: { color: '#fff' } } }
                            }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Add Income Modal */}
            {isIncomeModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Add Income</h3>
                            <button onClick={() => setIsIncomeModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
                        </div>
                        <form onSubmit={handleAddIncome} style={{ padding: '24px' }}>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Source</label>
                                <input type="text" placeholder="e.g. Salary, Freelance" className="styled-input" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                    value={incomeForm.source} onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Amount</label>
                                <input type="number" placeholder="0.00" className="styled-input" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                    value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Date</label>
                                <input type="date" className="styled-input" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                    value={incomeForm.date} onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '8px' }}>Save Income</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashFlow;
