import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import ENV from "../config/env.js";

export async function userSignUp(req, res, next){
    const session = mongoose.startSession();
    (await session).startTransaction();
    try{
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash password!
        const saltRounds = ENV.SALT_ROUNDS;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword,
        }], { session });

        const token = setToken(newUsers[0]._id);

        (await session).commitTransaction();
        (await session).endSession();

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0]
            }
        });
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
}

export async function userLogIn(req, res, next){

}

export async function userLogOut(req, res, next){

}