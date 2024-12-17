import Joi from 'joi';
import mongoose from 'mongoose';

const expenseSchema = Joi.object({
    account: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    name: Joi.string().max(100).required(),
    amount: Joi.number().positive().precision(2).required(),
    date: Joi.date().iso().required(),
    category: Joi.string().max(50).required(),
});

export default expenseSchema;
