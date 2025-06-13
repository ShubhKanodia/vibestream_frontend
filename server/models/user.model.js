import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'User Email is required!'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6
    },
    spotifyId: {
        type: String,
        unqiue: true,
        sparse: true,
    },
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

export default User;