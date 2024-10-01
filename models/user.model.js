import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }, 
    profile: {
        type: String,
        required: true
    }
    //createdAt and updatedAt
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;