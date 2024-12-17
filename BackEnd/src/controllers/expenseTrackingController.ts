import { Request, Response } from 'express';
import expenseSchema from '../validationSchemas/expenseSchema';
import { ValidationErrorItem } from 'joi';
import ExpenseModel from '../mongoSchemas/expenseSchema';
import UserModel from '../mongoSchemas/userSchema';
import categorySchema from '../validationSchemas/categorySchema';
import CategoryModel from '../mongoSchemas/categorySchema';
import mongoose from 'mongoose';

export const addMultipleExpenses = async (req: Request, res: Response) => {
    try {
        const { account, expenses } = req.body;

        // Check if the account exists in the users table
        const userExists = await UserModel.findById(account);
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: 'Account does not exist'
            });
        }

        const expenseResults = [];

        for (const expense of expenses) {
            // Validate each expense object
            expense.account = account;
            const { error } = expenseSchema.validate(expense, { abortEarly: false });
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details.map((detail: ValidationErrorItem) => detail.message)
                });
            }

            const { name, amount, date, category } = expense;
            const expenseData = { account, name, amount, date, category };
            const newExpense = new ExpenseModel(expenseData);
            const savedExpense = await newExpense.save();

            expenseResults.push(savedExpense);
        }

        return res.status(200).json({ success: true, expenses: expenseResults });
    } catch (error) {
        console.error('Error adding multiple expenses', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const { accountId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }

        // Find all expenses associated with the account
        const expenses = await ExpenseModel.find({ account: accountId });

        // Check if expenses exist
        if (!expenses.length) {
            return res.status(404).json({ message: 'No expenses found for this account' });
        }

        // Return the expenses
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateExpenses = async (req: Request, res: Response) => {
    const { modifiedExpenses } = req.body;

    if (!modifiedExpenses || !Array.isArray(modifiedExpenses)) {
        return res.status(400).json({ message: 'Invalid data format.' });
    }

    try {
        const updatePromises = modifiedExpenses.map(async (expense) => {
            const { _id, name, amount, date, category } = expense;

            // Find the expense by ID and update it
            return await ExpenseModel.findByIdAndUpdate(
                _id,
                { name, amount, date, category },
                { new: true, runValidators: true } // `new: true` returns the updated document
            );
        });

        // Await all updates
        const updatedExpenses = await Promise.all(updatePromises);

        return res.status(200).json({ message: 'Expenses updated successfully', updatedExpenses });
    } catch (error) {
        console.error('Error updating expenses:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteExpenses = async (req: Request, res: Response) => {
    try {
        const { deletedExpenses } = req.body;

        // Validate that the deletedExpenses array exists and is not empty
        if (!deletedExpenses || !deletedExpenses.length) {
            return res.status(400).json({ message: 'No expenses to delete.' });
        }

        // Use the Mongoose method to delete multiple expenses by their IDs
        await ExpenseModel.deleteMany({
            _id: { $in: deletedExpenses }
        });

        return res.status(200).json({ message: 'Expenses deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expenses:', error);
        return res.status(500).json({ message: 'Error deleting expenses.' });
    }
};

export const addCategories = async (req: Request, res: Response) => {
    try {
        const { account, categories } = req.body;

        // Check if the account exists in the users table
        const userExists = await UserModel.findById(account);
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: 'Account does not exist'
            });
        }

        const categoryResults = [];

        for (const category of categories) {
            // Validate each expense object
            const { error } = categorySchema.validate(category, { abortEarly: false });
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details.map((detail: ValidationErrorItem) => detail.message)
                });
            }
            category.account = account;
            const newCategory = new CategoryModel(category);
            const savedCategory = await newCategory.save();

            categoryResults.push(savedCategory);
        }

        return res.status(200).json({ success: true, categories: categoryResults });
    } catch (error) {
        console.error('Error adding multiple expenses', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
      const { accountId } = req.params;
  
      if (!accountId) {
        return res.status(400).json({ error: 'Account ID is required.' });
      }
  
      const categories = await CategoryModel.find({ account: accountId });
  
      if (!categories.length) {
        return res.status(404).json({ message: 'No categories found for this account.' });
      }
  
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error retrieving categories:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

export const updateCategories = async (req: Request, res: Response) => {
    const { modifiedCategories } = req.body;

    if (!modifiedCategories || !Array.isArray(modifiedCategories)) {
        return res.status(400).json({ message: 'Invalid data format.' });
    }

    try {
        const updatePromises = modifiedCategories.map(async (category) => {
            const { _id, name, color } = category;

            // Find the category by ID and update it
            return await CategoryModel.findByIdAndUpdate(
                _id,
                { name, color },
                { new: true, runValidators: true } // `new: true` returns the updated document
            );
        });

        // Await all updates
        const updatedCategories = await Promise.all(updatePromises);

        return res.status(200).json({ message: 'Categories updated successfully', updatedCategories });
    } catch (error) {
        console.error('Error updating categories:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteCategories = async (req: Request, res: Response) => {
    try {
        const { deletedCategories } = req.body;

        // Validate that the deletedCategories array exists and is not empty
        if (!deletedCategories || !deletedCategories.length) {
            return res.status(400).json({ message: 'No categories to delete.' });
        }

        // Use the Mongoose method to delete multiple categories by their IDs
        await CategoryModel.deleteMany({
            _id: { $in: deletedCategories }
        });

        return res.status(200).json({ message: 'Categories deleted successfully.' });
    } catch (error) {
        console.error('Error deleting categories:', error);
        return res.status(500).json({ message: 'Error deleting categories.' });
    }
};

module.exports = { addMultipleExpenses, addCategories, updateExpenses, deleteExpenses, getCategories, getExpenses, updateCategories, deleteCategories };