import User from '../models/user.model.js';
import bycrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const {email, password} = req.body;

        //TODO: password validation code
        
        const user = await User.findOne({email}).exec();

        if(user) {
            return res.status(400).json({error: 'User already exists'});
        }

        //TODO: hash password here
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email.displayName}`;
        // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email.displayName}`;
        // Determine profile picture based on email domain
        const emailDomain = email.split('@')[1];
        let profilePic;
        
        if (emailDomain === 'gmail.com') { // Replace 'example.com' with your domain or criteria
            profilePic = `https://avatar.iran.liara.run/public/boy?username=${email}`;
        } else {
            profilePic = `https://avatar.iran.liara.run/public/girl?username=${email}`;
        }

        const newUser = new User({
            email,
            password: hashedPassword,
            profilePic: profilePic, //TODO: have to add this conditionally
        });

        if(newUser) {
        //TODO: generate jwt token here
        generateTokenAndSetCookie(newUser._id, res);

        await newUser.save();
        
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
        } else {
            res.status(400).json({error: 'Invalid user Data' });
        }

    } catch (error) {
        console.log('error in signup controller:', error);
        res.status(500).json({error: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).exec();
        const isPasswordCorrect = await bycrypt.compare(password, user?.password || '');

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            profilePic: user.profilePic, 
        })
    } catch (error) {
        console.log('error in login controller:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const logout = (req, res) => {
    console.log('logoutUser');
}
