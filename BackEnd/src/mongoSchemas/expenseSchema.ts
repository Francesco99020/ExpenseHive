import mongoose, { Schema, Document, Types } from 'mongoose';

interface Expense extends Document{
    account: Types.ObjectId;
    name: String;
    amount: Number;
    date: Date;
    category: String;
}

const expenseSchema: Schema = new Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true
    }

});

const ExpenseModel = mongoose.model<Expense>('expense', expenseSchema);

export default ExpenseModel;