import registerSchema from '../validationSchemas/registerSchema';
import UserModel from '../mongoSchemas/userSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ValidationErrorItem } from 'joi';

export const register = async (req: Request, res: Response) => {
    try {
        const { error } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map((detail: ValidationErrorItem) => detail.message)
            });            
        }

        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new UserModel({
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
    
        // Find user by username
        const user = await UserModel.findOne({ username });
        if (!user) {
          return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }
    
        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }
    
        // If username and password are valid, generate JWT token
        const token = jwt.sign({ userId: user._id }, 'X&W$z#5*8@2!vPq', { expiresIn: '1h' });
    
        // Return the JWT token in the response
        res.status(200).json({ success: true, token, account: user._id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
      }
};
