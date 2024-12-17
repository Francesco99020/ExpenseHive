import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Expense } from '../../types/types';
import { useNavigate } from 'react-router-dom';

interface ExpenseVisualizationProps {
    onExpensesChange: (expenses: Expense[]) => void;
}

const ExpenseVisualization: React.FC<ExpenseVisualizationProps> = ({ onExpensesChange }) => {
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
    const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
    const [data, setData] = useState<{ name: string, value: number, color: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString('en-GB'));
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpensesAndCategories = async () => {
            try {
                const accountId = localStorage.getItem('account');

                // Fetch expenses
                const expenseResponse = await axios.get(`http://localhost:3001/api/expenseTracking/getExpenses/${accountId}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const expenses = expenseResponse.data;

                // Fetch categories with colors
                const categoryResponse = await axios.get(`http://localhost:3001/api/expenseTracking/getCategories/${accountId}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const categories = categoryResponse.data;

                // Map category name to its color
                const categoryColorMap: Record<string, string> = {};
                categories.forEach((category: any) => {
                    categoryColorMap[category.name] = category.color;
                });

                const [day, month, year] = selectedDate.split('-').map(Number);
                const selectedDateObj = new Date(year, month - 1, day);

                let filteredExpenses;

                switch (timeframe) {
                    case 'daily':
                        filteredExpenses = expenses.filter((expense: any) => {
                            var dateArray = expense.date.split("-");
                            var year = parseInt(dateArray[0]);
                            var month = parseInt(dateArray[1], 10) - 1;
                            var dayArray = dateArray[2].split("T").slice(0, -1);
                            var day = parseInt(dayArray[0]);
                            const expenseDate = new Date(year, month, day);
                            return expenseDate.toDateString() === selectedDateObj.toDateString();
                        });
                        break;
                    case 'weekly':
                        const startOfWeek = new Date(selectedDateObj);
                        startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());
                        const endOfWeek = new Date(startOfWeek);
                        endOfWeek.setDate(startOfWeek.getDate() + 6);

                        filteredExpenses = expenses.filter((expense: any) => {
                            var dateArray = expense.date.split("-");
                            var year = parseInt(dateArray[0]);
                            var month = parseInt(dateArray[1], 10) - 1;
                            var dayArray = dateArray[2].split("T").slice(0, -1);
                            var day = parseInt(dayArray[0]);
                            const expenseDate = new Date(year, month, day);
                            return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
                        });
                        break;
                    case 'monthly':
                        filteredExpenses = expenses.filter((expense: any) => {
                            var dateArray = expense.date.split("-");
                            var year = parseInt(dateArray[0]);
                            var month = parseInt(dateArray[1], 10) - 1;
                            var dayArray = dateArray[2].split("T").slice(0, -1);
                            var day = parseInt(dayArray[0]);
                            const expenseDate = new Date(year, month, day);
                            return (
                                expenseDate.getMonth() === selectedDateObj.getMonth() &&
                                expenseDate.getFullYear() === selectedDateObj.getFullYear()
                            );
                        });
                        break;
                    case 'yearly':
                        filteredExpenses = expenses.filter((expense: any) => {
                            var dateArray = expense.date.split("-");
                            var year = parseInt(dateArray[0]);
                            var month = parseInt(dateArray[1], 10) - 1;
                            var dayArray = dateArray[2].split("T").slice(0, -1);
                            var day = parseInt(dayArray[0]);
                            const expenseDate = new Date(year, month, day);
                            return expenseDate.getFullYear() === selectedDateObj.getFullYear();
                        });
                        break;
                    default:
                        filteredExpenses = expenses;
                        break;
                }

                setFilteredExpenses(filteredExpenses);
                onExpensesChange(filteredExpenses);

                const groupedExpenses = filteredExpenses.reduce((acc: any, expense: any) => {
                    const category = expense.category;
                    const amount = expense.amount;

                    if (!acc[category]) {
                        acc[category] = 0;
                    }
                    acc[category] += amount;

                    return acc;
                }, {});

                const chartData = Object.keys(groupedExpenses).map((category) => ({
                    name: category,
                    value: groupedExpenses[category],
                    color: categoryColorMap[category] || '#000000',
                }));

                setData(chartData);
            } catch (error) {
                console.error('Error fetching expenses or categories:', error);

                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchExpensesAndCategories();
    }, [timeframe, selectedDate, onExpensesChange]);

    const handleChartToggle = () => {
        setChartType(chartType === 'pie' ? 'bar' : 'pie');
    };

    const handleTimeframeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly');
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-dark-brown">MY EXPENSES</h2>
                <input
                    type="date"
                    value={selectedDate.split('-').reverse().join('-')}
                    onChange={(e) => setSelectedDate(e.target.value.split('-').reverse().join('-'))}
                    className="bg-dark-yellow text-dark-brown rounded px-2"
                />
            </div>
            <div className="mb-4">
                <div className="relative flex justify-between w-full max-w-xs">
                    {['daily', 'weekly', 'monthly', 'yearly'].map((option) => (
                        <label key={option} className="cursor-pointer text-dark-brown flex-1 text-center">
                            <input
                                type="radio"
                                value={option}
                                checked={timeframe === option}
                                onChange={handleTimeframeChange}
                                className="sr-only"
                            />
                            <span className="relative">
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                {timeframe === option && (
                                    <span className="absolute left-0 right-0 -bottom-1 block h-1 bg-dark-brown transition-all duration-300 ease-in-out" />
                                )}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={handleChartToggle}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Toggle {chartType === 'pie' ? 'Bar Chart' : 'Pie Chart'}
                </button>
            </div>
            <div className="flex">
                <div className="w-2/3">
                    {chartType === 'pie' ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="w-1/3">
                    <ul>
                        {data.map((entry) => (
                            <li key={entry.name} style={{ color: entry.color }}>
                                <b>
                                    {entry.name}: {((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(2)}%
                                </b>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ExpenseVisualization;