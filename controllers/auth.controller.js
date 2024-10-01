import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

export const signup = async (req, res) => {
	try {
		const { name, email, password} = req.body;

		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

        const generateGravatarUrl = (email) => {
            const hash = CryptoJS.MD5(email.trim().toLowerCase());
            return `https://www.gravatar.com/avatar/${hash}?d=retro`;
        }
        const userProfile = generateGravatarUrl(email);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
            profile: userProfile,
		});

		if (newUser) {
			// Generate JWT token here
			// generateTokenAndSetCookie(newUser._id, res);
            const userId = newUser._id;
            const token = jwt.sign({userId}, process.env.JWT_SECRET, {
                expiresIn: "15d",
            });
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
                token: token,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
    try {
        // Destructure email and password from request body
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email }).exec();

        // Check if the user exists and the password is correct
        const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a token and set it in a cookie
        // await generateTokenAndSetCookie(user._id, res);
        const userId = user._id;
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });

        // Respond with user details
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        });
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error('Error in login controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = (req, res) => {
    try {
        console.log('I am here for Logging out...');
        // Clear the JWT cookie by setting its maxAge to 0
        res.cookie('jwt', '', { maxAge: 0 });

        // Send a successful response
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        // Log the error and send a 500 response
        console.log('Error in logout controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
