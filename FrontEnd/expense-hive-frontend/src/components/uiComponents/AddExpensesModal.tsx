import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface ExpenseForm {
    name: string;
    amount: string;
    date: string;
    category: string;
}

interface AddExpensesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: ExpenseForm[]) => void;
}

interface CategoryOption {
    value: string;
    label: string;
}

const AddExpensesModal: React.FC<AddExpensesModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [expenses, setExpenses] = useState<ExpenseForm[]>([{ name: '', amount: '', date: '', category: '' }]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/expenseTracking/getCategories/${localStorage.getItem('account')}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                const options = response.data.map((category: { _id: string, name: string }) => ({
                    value: category._id,
                    label: category.name,
                }));
                setCategoryOptions(options);
                console.log(options)
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleFormChange = (index: number, field: keyof ExpenseForm, value: string) => {
        const newExpenses = [...expenses];
        newExpenses[index][field] = value;
        setExpenses(newExpenses);
    };

    const handleAddExpense = () => {
        setExpenses([...expenses, { name: '', amount: '', date: '', category: '' }]);
        setCurrentFormIndex(expenses.length);
    };

    const handleRemoveExpense = () => {
        const newExpenses = expenses.filter((_, index) => index !== currentFormIndex);
        setExpenses(newExpenses);
        setCurrentFormIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const isFormValid = expenses.every(expense =>
            Object.values(expense).every(value => value.trim() !== '')
        );

        if (isFormValid) {
            onSubmit(expenses);
            handleClose();
        } else {
            alert('Please fill out all fields before submitting.');
        }
    };

    const handleClose = () => {
        onClose();
        setExpenses([{ name: '', amount: '', date: '', category: '' }]);
        setCurrentFormIndex(0);
    };

    if (!isOpen) return null;

    const currentExpense = expenses[currentFormIndex];
    const isMultipleExpenses = expenses.length > 1;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-yellow p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-dark-brown text-2xl font-bold mb-4">
                    {isMultipleExpenses ? 'Add Expenses' : 'Add Expense'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isMultipleExpenses && (
                        <span className="text-dark-brown font-bold">
                            Expense {currentFormIndex + 1} of {expenses.length}
                        </span>
                    )}
                    <div>
                        <label className="block text-dark-brown">Name</label>
                        <input
                            type="text"
                            value={currentExpense.name}
                            onChange={(e) => handleFormChange(currentFormIndex, 'name', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-dark-brown">Amount</label>
                        <input
                            type="text"
                            value={currentExpense.amount}
                            onChange={(e) => {
                                const { value } = e.target;
                                const validAmountPattern = /^\d*\.?\d{0,2}$/;
                                if (validAmountPattern.test(value)) {
                                    handleFormChange(currentFormIndex, 'amount', value);
                                }
                            }}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-dark-brown">Date</label>
                        <input
                            type="date"
                            value={currentExpense.date}
                            onChange={(e) => handleFormChange(currentFormIndex, 'date', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label>Category</label>
                        <Select
                            options={categoryOptions}
                            placeholder="Select a category"
                            value={categoryOptions.find(option => option.value === currentExpense.category)}
                            onChange={(selectedOption) => handleFormChange(currentFormIndex, 'category', selectedOption?.label || '')}
                        />
                    </div>
                    {isMultipleExpenses && (
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentFormIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentFormIndex((prevIndex) => Math.min(prevIndex + 1, expenses.length - 1))}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Next
                            </button>
                        </div>
                    )}
                    <div className="flex justify-between mt-4">
                        {isMultipleExpenses && (
                            <button
                                type="button"
                                onClick={handleRemoveExpense}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove this Expense
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleAddExpense}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Another Expense
                        </button>
                    </div>
                    <div className="flex justify-between space-x-4 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpensesModal;