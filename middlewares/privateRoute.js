import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const privateRoute = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.jwt || req.body.jwt || req.params.jwt || req.headers['authorization'].split(' ')[1];
        console.log('req:', req);
        console.log('req body:', req.body);
        console.log('req Params:', req.params.jwt);
        if(!token) {
            console.log('im here in private route middleware', token, req);
        }
        // Check if token exists in cookies
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('token verified', decoded);

        // Check if token is valid
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid Token, verification failed' });
        }
        
        // Find the user associated with the token
        const user = await User.findById(decoded.userId).select('-password');
        console.log('im here in private route middlewarea', user);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Attach user information to request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        // Log the error and respond with a 500 status
        console.log('Error in privateRoute middleware:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default privateRoute;