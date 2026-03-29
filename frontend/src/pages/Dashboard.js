import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import {
    FiArrowUpRight, FiArrowDownRight,
    FiShoppingBag, FiCoffee, FiTruck, FiHome, FiActivity, FiLayers, FiCreditCard
} from 'react-icons/fi';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ThreeDCard from '../components/ThreeDCard';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgetLimit, setBudgetLimit] = useState(50000);
    const [userName, setUserName] = useState('Explorer');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expRes, profRes] = await Promise.all([
                    axiosInstance.get('/api/expenses/'),
                    axiosInstance.get('/api/profile/')
                ]);
                setExpenses(expRes.data);
                if (profRes.data.profile?.monthly_budget) {
                    setBudgetLimit(parseFloat(profRes.data.profile.monthly_budget));
                }
                if (profRes.data.first_name) setUserName(profRes.data.first_name);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatRupee = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    // Stats
    const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const budgetLeft = budgetLimit - totalExpense;
    const progress = Math.min((totalExpense / budgetLimit) * 100, 100);

    // Mock Net Worth Logic for Visuals
    const netWorth = 1245000;

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Net Worth',
            data: [1100000, 1150000, 1120000, 1180000, 1200000, netWorth],
            borderColor: '#00F0FF',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
                return gradient;
            },
            pointBackgroundColor: '#00F0FF',
            pointBorderColor: '#fff',
            fill: true, tension: 0.4, borderWidth: 3
        }]
    };

    const { theme } = useTheme();

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: theme === 'dark' ? 'rgba(3, 0, 20, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: theme === 'dark' ? '#fff' : '#0F172A',
                bodyColor: theme === 'dark' ? '#00F0FF' : '#4F46E5',
                borderColor: 'var(--glass-border)',
                borderWidth: 1,
                padding: 12,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: theme === 'dark' ? '#6B6B90' : '#64748B' }
            },
            y: {
                grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#E2E8F0' },
                ticks: { color: theme === 'dark' ? '#6B6B90' : '#64748B' }
            }
        }
    };

    const getCategoryIcon = (catName) => {
        const name = catName?.toLowerCase() || '';
        if (name.includes('food')) return <FiCoffee />;
        if (name.includes('travel') || name.includes('transport')) return <FiTruck />;
        if (name.includes('shop')) return <FiShoppingBag />;
        return <FiActivity />;
    };

    return (
        <div className="dashboard-container">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
                <div>
                    <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-main)', letterSpacing: '-1px' }}>
                        Hello, {userName}
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Your financial command center is ready.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Net Worth</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>₹12,45,000</div>
                </div>
            </motion.div>

            {/* 3D Stats Row */}
            <div className="stats-row">
                <ThreeDCard title="Monthly Spend">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="value">{formatRupee(totalExpense)}</div>
                        <div style={{ background: 'rgba(112, 69, 255, 0.2)', padding: '10px', borderRadius: '12px', color: '#7045FF' }}><FiCreditCard size={24} /></div>
                    </div>
                    <div style={{ marginTop: '16px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, background: '#7045FF', height: '100%' }} />
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#A0A0C0' }}>{Math.round(progress)}% of budget used</div>
                </ThreeDCard>

                <ThreeDCard title="Budget Left">
                    <div className="value" style={{ color: budgetLeft < 0 ? '#FF2E7E' : '#00F0FF' }}>
                        {formatRupee(budgetLeft)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: budgetLeft < 0 ? '#FF2E7E' : '#00F0FF' }}>
                        {budgetLeft < 0 ? <FiArrowDownRight /> : <FiArrowUpRight />}
                        <span>{budgetLeft < 0 ? 'Over Budget' : 'On Track'}</span>
                    </div>
                </ThreeDCard>

                <ThreeDCard title="Savings Rate">
                    <div className="value" style={{ color: '#10B981' }}>+24%</div>
                    <div style={{ marginTop: '12px', color: '#A0A0C0', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                        vs Last Month
                    </div>
                </ThreeDCard>

                <ThreeDCard title="Total Assets">
                    <div className="value">3.2 Cr</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <span style={{ padding: '4px 8px', background: 'rgba(0, 240, 255, 0.1)', color: '#00F0FF', borderRadius: '4px', fontSize: '0.8rem' }}>Stock</span>
                        <span style={{ padding: '4px 8px', background: 'rgba(255, 46, 126, 0.1)', color: '#FF2E7E', borderRadius: '4px', fontSize: '0.8rem' }}>Crypto</span>
                    </div>
                </ThreeDCard>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>

                {/* Chart Section */}
                <ThreeDCard title="Wealth Trajectory">
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </ThreeDCard>

                {/* Recent Transactions */}
                <ThreeDCard title="Recent Activity">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {expenses.slice(0, 4).map(exp => (
                            <div key={exp.id} style={{ display: 'flex', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: 'var(--glass-surface)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px',
                                    color: 'var(--text-main)', border: '1px solid var(--glass-border)'
                                }}>
                                    {getCategoryIcon(exp.category_name)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{exp.description}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{exp.date}</div>
                                </div>
                                <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>- {formatRupee(exp.amount)}</div>
                            </div>
                        ))}
                        {expenses.length === 0 && <div style={{ color: '#6B6B90', textAlign: 'center', padding: '20px' }}>No quiet activities...</div>}
                    </div>
                </ThreeDCard>
            </div>
        </div>
    );
};

export default Dashboard;
