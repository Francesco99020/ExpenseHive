import mongoose, { Schema, Document, Types } from 'mongoose';

interface Category extends Document {
    account: Types.ObjectId;
    name: string;
    color: string;
}

const categorySchema: Schema = new Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    color: {
        type: String,
        required: true,
        unique: true,
    },
});

const CategoryModel = mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
