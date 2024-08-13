import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        // Extract the ID of the logged-in user from the request
        const loggedInUserId = req.user._id;

        // Find users excluding the logged-in user and select fields except for password
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        // Respond with the list of filtered users
        res.status(200).json(filteredUsers);
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error('Error in getUsersForSidebar:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};