import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axios';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { FiDownload, FiCalendar, FiPieChart, FiBarChart2, FiTrendingUp, FiActivity } from 'react-icons/fi';

// Register ChartJS Components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Reports = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // '7', '30', '90', 'all'

    // Fetch Expenses
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await axiosInstance.get('/api/expenses/');
                setExpenses(res.data);
            } catch (err) {
                console.error("Failed to fetch expenses", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    // Filter Data Logic
    useEffect(() => {
        if (!expenses.length) return;

        const now = new Date();
        let filtered = expenses;

        if (dateRange !== 'all') {
            const days = parseInt(dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(now.getDate() - days);

            filtered = expenses.filter(e => new Date(e.date) >= cutoffDate);
        }

        setFilteredExpenses(filtered);
    }, [expenses, dateRange]);

    // Format Currency
    const formatRupee = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate Summary Stats
    const stats = useMemo(() => {
        const total = filteredExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        const count = filteredExpenses.length;
        const avg = count > 0 ? total / count : 0;

        // Find Highest Category
        const catTotals = {};
        filteredExpenses.forEach(e => {
            catTotals[e.category_name] = (catTotals[e.category_name] || 0) + parseFloat(e.amount);
        });
        const highestCat = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b, '') || '-';

        return { total, count, avg, highestCat };
    }, [filteredExpenses]);

    // Prepare Chart Data
    const pieData = useMemo(() => {
        const catTotals = {};
        filteredExpenses.forEach(e => {
            const cat = e.category_name || 'Other';
            catTotals[cat] = (catTotals[cat] || 0) + parseFloat(e.amount);
        });

        return {
            labels: Object.keys(catTotals),
            datasets: [{
                data: Object.values(catTotals),
                backgroundColor: [
                    '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
                ],
                borderWidth: 0
            }]
        };
    }, [filteredExpenses]);

    const barData = useMemo(() => {
        // Group by Month (YYYY-MM)
        const monthTotals = {};
        filteredExpenses.forEach(e => {
            const date = new Date(e.date);
            const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthTotals[key] = (monthTotals[key] || 0) + parseFloat(e.amount);
        });

        // Sort months roughly (simple approach) or rely on API sort if consistent. 
        // For Filtered < 90 days, maybe group by Week or Day? Staying with simple logic for now.

        return {
            labels: Object.keys(monthTotals),
            datasets: [{
                label: 'Expenses',
                data: Object.values(monthTotals),
                backgroundColor: '#4F46E5',
                borderRadius: 4
            }]
        };
    }, [filteredExpenses]);

    // Export CSV
    const handleExport = () => {
        if (!filteredExpenses.length) return;

        const headers = ["Date", "Category", "Description", "Method", "Amount"];
        const rows = filteredExpenses.map(e => [
            e.date,
            e.category_name,
            `"${e.description || ''}"`, // Quote description to handle commas
            e.payment_method,
            e.amount
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `expense_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-container">
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Financial Reports</h2>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Analyze your spending patterns.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex' }}>
                        {['7', '30', '90', 'all'].map(range => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                style={{
                                    padding: '6px 16px',
                                    border: 'none',
                                    background: dateRange === range ? '#EEF2FF' : 'transparent',
                                    color: dateRange === range ? '#4F46E5' : '#64748B',
                                    fontWeight: dateRange === range ? '600' : '400',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {range === 'all' ? 'All Time' : `${range} Days`}
                            </button>
                        ))}
                    </div>
                    <button className="btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiDownload /> Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="stats-row" style={{ marginBottom: '24px' }}>
                <div className="card stat-card">
                    <div className="label">Total Expense</div>
                    <div className="value" style={{ color: '#EF4444' }}>{formatRupee(stats.total)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>in selected period</div>
                </div>
                <div className="card stat-card">
                    <div className="label">Highest Category</div>
                    <div className="value" style={{ fontSize: '1.25rem' }}>{stats.highestCat}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>Top spending area</div>
                </div>
                <div className="card stat-card">
                    <div className="label">Avg. Transaction</div>
                    <div className="value">{formatRupee(stats.avg)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>per expense</div>
                </div>
                <div className="card stat-card">
                    <div className="label">Transactions</div>
                    <div className="value">{stats.count}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>total operations</div>
                </div>
            </div>

            {/* Charts Grid */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Loading reports...</div>
            ) : filteredExpenses.length > 0 ? (
                <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {/* Pie Chart */}
                    <div className="card">
                        <div className="chart-header">
                            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiPieChart /> Expense Breakdown
                            </div>
                        </div>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="card">
                        <div className="chart-header">
                            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiBarChart2 /> Monthly Trend
                            </div>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Bar
                                data={barData}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                                        x: { grid: { display: false } }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ background: '#F1F5F9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                        <FiActivity size={32} color="#94A3B8" />
                    </div>
                    <h3>No data available</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>Add expenses to verify your spending reports.</p>
                </div>
            )}
        </div>
    );
};

export default Reports;
