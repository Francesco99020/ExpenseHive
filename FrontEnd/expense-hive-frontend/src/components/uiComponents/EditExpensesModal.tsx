import React, { useState, useEffect } from 'react';
import { Expense } from '../../types/types';
import axios from 'axios';

interface EditExpensesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (updatedExpenses: Expense[], deletedExpenses: string[]) => void;
}

const EditExpensesModal: React.FC<EditExpensesModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editedExpenses, setEditedExpenses] = useState<Record<string, Expense>>({});
    const [expensesToDelete, setExpensesToDelete] = useState<Set<string>>(new Set());

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
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        if (isOpen) {
            fetchExpenses();
        }
    }, [isOpen]);

    const handleInputChange = (id: string, field: keyof Expense, value: string | number | Date) => {
        setEditedExpenses((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [field]: value,
                _id: id,
            },
        }));
    };

    const toggleDeleteExpense = (id: string) => {
        setExpensesToDelete((prevState) => {
            const updatedSet = new Set(prevState);
            if (updatedSet.has(id)) {
                updatedSet.delete(id);
            } else {
                updatedSet.add(id);
            }
            return updatedSet;
        });
    };

    const handleSubmit = () => {
        const allExpenses = expenses.map((expense) => ({
            ...expense,
            ...editedExpenses[expense._id],
        }));

        if (allExpenses.some((expense) => !expense.name || !expense.amount || !expense.date || !expense.category)) {
            alert('All fields must be filled out.');
            return;
        }

        const modifiedExpenses = allExpenses.filter((expense, index) => {
            const originalExpense = expenses[index];
            return (
                expense.name !== originalExpense.name ||
                expense.amount !== originalExpense.amount ||
                expense.date !== originalExpense.date ||
                expense.category !== originalExpense.category
            );
        });

        onSubmit(modifiedExpenses, Array.from(expensesToDelete));
        handleModalClose();
    };

    const handleModalClose = () => {
        setEditedExpenses({});
        setExpensesToDelete(new Set());
        onClose();
    };

    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-yellow p-8 rounded-lg shadow-lg w-full max-w-lg h-4/5 flex flex-col">
                <h2 className="text-dark-brown text-2xl font-bold mb-4">Edit Expenses</h2>
                <div className="flex-grow overflow-y-auto space-y-4">
                    {expenses.map((expense) => (
                        <div
                            key={expense._id}
                            className={`space-y-2 border-b border-dark-brown p-4 rounded-lg ${
                                expensesToDelete.has(expense._id) ? 'bg-red-500' : ''
                            }`}
                        >
                            <div>
                                <label className="block text-dark-brown">Name</label>
                                <input
                                    type="text"
                                    value={editedExpenses[expense._id]?.name ?? expense.name}
                                    onChange={(e) => handleInputChange(expense._id, 'name', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled={expensesToDelete.has(expense._id)}
                                />
                            </div>
                            <div>
                                <label className="block text-dark-brown">Amount</label>
                                <input
                                    type="number"
                                    value={editedExpenses[expense._id]?.amount ?? expense.amount}
                                    onChange={(e) => handleInputChange(expense._id, 'amount', parseFloat(e.target.value))}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled={expensesToDelete.has(expense._id)}
                                />
                            </div>
                            <div>
                                <label className="block text-dark-brown">Date</label>
                                <input
                                    type="date"
                                    value={editedExpenses[expense._id]?.date?.toString().split('T')[0] ?? expense.date.toString().split('T')[0]}
                                    onChange={(e) => handleInputChange(expense._id, 'date', new Date(e.target.value))}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled={expensesToDelete.has(expense._id)}
                                />
                            </div>
                            <div>
                                <label className="block text-dark-brown">Category</label>
                                <input
                                    type="text"
                                    value={editedExpenses[expense._id]?.category ?? expense.category}
                                    onChange={(e) => handleInputChange(expense._id, 'category', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled={expensesToDelete.has(expense._id)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleDeleteExpense(expense._id)}
                                className={`mt-2 px-4 py-2 rounded ${
                                    expensesToDelete.has(expense._id) ? 'bg-green-500' : 'bg-red-500'
                                } text-white`}
                            >
                                {expensesToDelete.has(expense._id) ? 'Undo' : 'Delete'}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between space-x-4 mt-4">
                    <button
                        type="button"
                        onClick={handleModalClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Submit Changes
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default EditExpensesModal;