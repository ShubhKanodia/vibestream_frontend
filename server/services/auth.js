import jwt from 'jsonwebtoken';
import ENV from '../config/env.js';

export function setToken(id){
    const payload = {
        userId: id
    }
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
}

export function verifyToken(token){
    return jwt.verify(token, ENV.JWT_SECRET);
}