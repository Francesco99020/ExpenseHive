import Joi from 'joi';

const categorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    color: Joi.string()
        .pattern(/^#[0-9A-Fa-f]{6}$/)
        .required(),
});

export default categorySchema;