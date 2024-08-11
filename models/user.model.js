import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
    //createdAt and updatedAt
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;