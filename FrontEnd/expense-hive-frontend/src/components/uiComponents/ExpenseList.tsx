import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Expense } from '../../types/types';
import '../../styleSheets/ExpenseList.css';

interface ExpenseListProps {
    expensesToMatch?: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expensesToMatch }) => {
    const [viewOption, setViewOption] = useState<'all' | 'matchOverview'>('all');
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const accountId = localStorage.getItem('account');
                const response = await axios.get(`http://localhost:3001/api/expenseTracking/getExpenses/${accountId}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                let fetchedExpenses = response.data;

                if (viewOption === 'matchOverview' && expensesToMatch) {
                    fetchedExpenses = fetchedExpenses.filter((expense: Expense) =>
                        expensesToMatch.some((e) => e._id === expense._id)
                    );
                }

                setExpenses(fetchedExpenses);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, [viewOption, expensesToMatch]);

    return (
        <div className="p-4 bg-light-yellow rounded-lg shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-between">
                    <button
                        onClick={() => setViewOption('all')}
                        className={`px-4 py-2 ${viewOption === 'all' ? 'underline' : ''}`}
                    >
                        All Expenses
                    </button>
                    <button
                        onClick={() => setViewOption('matchOverview')}
                        className={`px-4 py-2 ${viewOption === 'matchOverview' ? 'underline' : ''}`}
                    >
                        Match Overview
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto scroll-container mb-1">
                <ul>
                    {expenses.map((expense) => (
                        <li key={expense._id} className="border-b border-dark-brown py-2 p-2">
                            <div className="flex justify-between">
                                <span>{expense.name}</span>
                                <span>${expense.amount.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">
                                Category: {expense.category}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExpenseList;