import React, { useState, useEffect } from 'react';
import { Category } from '../../types/types';
import axios from 'axios';

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (updatedCategories: Category[], deletedCategories: string[]) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editedCategories, setEditedCategories] = useState<Record<string, Category>>({});
    const [categoriesToDelete, setCategoriesToDelete] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const accountId = localStorage.getItem('account');
                const response = await axios.get(`http://localhost:3001/api/expenseTracking/getCategories/${accountId}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleInputChange = (id: string, field: keyof Category, value: string) => {
        setEditedCategories((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [field]: value,
                _id: id,
            },
        }));
    };

    const toggleDeleteCategory = (id: string) => {
        setCategoriesToDelete((prevState) => {
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
        const allCategories = categories.map((category) => ({
            ...category,
            ...editedCategories[category._id],
        }));

        const isDuplicateName = new Set(allCategories.map((category) => category.name)).size !== allCategories.length;
        const isDuplicateColor = new Set(allCategories.map((category) => category.color)).size !== allCategories.length;

        if (isDuplicateName || isDuplicateColor) {
            alert('Duplicate names or colors detected. Please ensure each category has a unique name and color.');
            return;
        }

        if (allCategories.some((category) => !category.name || !category.color)) {
            alert('All fields must be filled out.');
            return;
        }

        const modifiedCategories = allCategories.filter((category, index) => {
            const originalCategory = categories[index];
            return (
                category.name !== originalCategory.name ||
                category.color !== originalCategory.color
            );
        });

        onSubmit(modifiedCategories, Array.from(categoriesToDelete));
        handleModalClose();
    };

    const handleModalClose = () => {
        setEditedCategories({});
        setCategoriesToDelete(new Set());
        onClose();
    };

    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-yellow p-8 rounded-lg shadow-lg w-full max-w-lg h-4/5 flex flex-col">
                <h2 className="text-dark-brown text-2xl font-bold mb-4">Edit Categories</h2>
                <div className="flex-grow overflow-y-auto space-y-4">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className={`space-y-2 border-b border-dark-brown p-4 rounded-lg ${
                                categoriesToDelete.has(category._id) ? 'bg-red-500' : ''
                            }`}
                        >
                            <div>
                                <label className="block text-dark-brown">Name</label>
                                <input
                                    type="text"
                                    value={editedCategories[category._id]?.name ?? category.name}
                                    onChange={(e) => handleInputChange(category._id, 'name', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled={categoriesToDelete.has(category._id)}
                                />
                            </div>
                            <div>
                                <label className="block text-dark-brown">Color</label>
                                <input
                                    type="color"
                                    value={editedCategories[category._id]?.color || category.color}
                                    onChange={(e) => handleInputChange(category._id, 'color', e.target.value)}
                                    className="w-full p-1 border rounded h-10 block cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700"
                                    required
                                    disabled={categoriesToDelete.has(category._id)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleDeleteCategory(category._id)}
                                className={`mt-2 px-4 py-2 rounded ${
                                    categoriesToDelete.has(category._id) ? 'bg-green-500' : 'bg-red-500'
                                } text-white`}
                            >
                                {categoriesToDelete.has(category._id) ? 'Undo' : 'Delete'}
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

export default EditCategoryModal;