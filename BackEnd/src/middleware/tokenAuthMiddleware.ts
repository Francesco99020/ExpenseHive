import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    userId: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token found in authorization header' });
    }

    try {
        jwt.verify(token, 'X&W$z#5*8@2!vPq') as DecodedToken;
        next();
    } catch (err) {
        const error = err as VerifyErrors;

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        }
    }
};

export default verifyToken;
