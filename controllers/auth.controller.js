import User from '../models/user.model.js';
import bycrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log(req.body); // Debugging: log request body

        // TODO: Add password validation logic here

        // Check if the user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        // Determine profile picture based on email domain
        const emailDomain = email.split('@')[1];
        const profilePic = emailDomain === 'gmail.com'
            ? `https://avatar.iran.liara.run/public/boy?username=${email}`
            : `https://avatar.iran.liara.run/public/girl?username=${email}`;

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePic
        });

        // Save the new user and generate a token
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        // Respond with the created user details
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        // Log and respond with an error message
        console.error('Error in signup controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        // Destructure email and password from request body
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email }).exec();

        // Check if the user exists and the password is correct
        const isPasswordCorrect = user ? await bycrypt.compare(password, user.password) : false;

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a token and set it in a cookie
        generateTokenAndSetCookie(user._id, res);

        // Respond with user details
        res.status(200).json({
            _id: user._id,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error('Error in login controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the JWT cookie by setting its maxAge to 0
        res.cookie('jwt', '', { maxAge: 0 });

        // Send a successful response
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        // Log the error and send a 500 response
        console.error('Error in logout controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
