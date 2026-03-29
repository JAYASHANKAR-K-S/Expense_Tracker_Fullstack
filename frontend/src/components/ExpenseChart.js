import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ExpenseChart = ({ expenses }) => {
    // Group expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        const cat = expense.category_name || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + parseFloat(expense.amount);
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Expenses by Category',
                data: dataValues,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="chart-container" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            <div style={{ width: '400px' }}>
                <h3>Category Distribution</h3>
                <Pie data={data} />
            </div>
            <div style={{ width: '500px' }}>
                <h3>Spending Overview</h3>
                <Bar data={data} options={{ responsive: true }} />
            </div>
        </div>
    );
};

export default ExpenseChart;
