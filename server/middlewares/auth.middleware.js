import User from "../models/user.model.js";
import { verifyToken } from "../service/auth.service.js";

export const authorise = async (req, res, next) => {
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const decoded = verifyToken(token);
        
        const user = await User.findById(decoded.userId);

        if(!user){
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({
            message: 'Unauthorised',
            error: err.message,
        })
    }
}