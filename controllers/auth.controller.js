import User from '../models/user.model.js';

export const signup = async (req, res) => {
    try {
        const {email, password} = req.body;

        //TODO: password validation code
        
        const user = await User.findOne({email}).exec();

        console.log('user', user);
        if(user) {
            return res.status(400).json({error: 'User already exists'});
        }

        //TODO: hash password here


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email.displayName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email.displayName}`;

        const newUser = new User({
            email,
            password,
            profilePic: boyProfilePic, //TODO: have to add this conditionally
        });

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log('error in signup controller:', error);
        res.status(500).json({error: 'Internal server error' });
    }
}

export const login = (req, res) => {
    console.log('loginUser');
}

export const logout = (req, res) => {
    console.log('logoutUser');
}
