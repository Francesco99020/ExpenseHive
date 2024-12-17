import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CategoryForm } from '../../types/types';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (categories: CategoryForm[]) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [categories, setCategories] = useState<CategoryForm[]>([{ name: '', color: '#000000' }]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [existingCategories, setExistingCategories] = useState<CategoryForm[]>([]);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/expenseTracking/getCategories/${localStorage.getItem('account')}`,
                        {
                            headers: {
                                authorization: `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    setExistingCategories(response.data);
                } catch (error) {
                    console.error('Error fetching existing categories:', error);
                }
            };

            fetchCategories();
        } else {
            // Reset the state when the modal is closed
            setCategories([{ name: '', color: '#000000' }]);
            setCurrentIndex(0);
            setExistingCategories([]);
        }
    }, [isOpen]);

    const handleInputChange = (index: number, field: 'name' | 'color', value: string) => {
        const newCategories = [...categories];
        newCategories[index][field] = value;
        setCategories(newCategories);
    };

    const addAnotherCategory = () => {
        setCategories([...categories, { name: '', color: '#000000' }]);
        setCurrentIndex(categories.length);
    };

    const removeCategory = () => {
        const newCategories = categories.filter((_, index) => index !== currentIndex);
        setCategories(newCategories);
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const handleSubmit = () => {
        const filledCategories = categories.filter((category) => category.name.trim() !== '');

        // Check for duplicate names or colors within the current form
        const names = new Set();
        const colors = new Set();
        for (const category of filledCategories) {
            if (names.has(category.name) || colors.has(category.color)) {
                alert('Duplicate names or colors found within the form. Please choose unique values.');
                return;
            }
            names.add(category.name);
            colors.add(category.color);
        }

        // Check against existing categories
        for (const existingCategory of existingCategories) {
            if (names.has(existingCategory.name) || colors.has(existingCategory.color)) {
                alert('A category with the same name or color already exists. Please choose a unique name and color.');
                return;
            }
        }

        if (filledCategories.length === categories.length) {
            onSubmit(filledCategories);
            onClose();
        } else {
            alert('Please fill out all category fields.');
        }
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < categories.length - 1 ? prev + 1 : prev));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-yellow p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-dark-brown text-2xl font-bold mb-4">
                    {categories.length > 1 ? 'Add Categories' : 'Add Category'}
                </h2>
                <form className="space-y-4">
                    {categories.length > 1 && (
                        <span className="text-dark-brown font-bold">
                            Category {currentIndex + 1} of {categories.length}
                        </span>
                    )}
                    <div>
                        <label className="block text-dark-brown">Name</label>
                        <input
                            type="text"
                            value={categories[currentIndex].name}
                            onChange={(e) => handleInputChange(currentIndex, 'name', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-dark-brown">Color</label>
                        <input
                            type="color"
                            value={categories[currentIndex].color}
                            onChange={(e) => handleInputChange(currentIndex, 'color', e.target.value)}
                            className="w-full p-1 border rounded h-10 block cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700"
                            required
                        />
                    </div>

                    <div className="flex justify-between">
                        {categories.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Next
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={addAnotherCategory}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add Another Category
                        </button>
                        {categories.length > 1 && (
                            <button
                                type="button"
                                onClick={removeCategory}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove This Category
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between space-x-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            {categories.length > 1 ? 'Submit All Categories' : 'Submit Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;