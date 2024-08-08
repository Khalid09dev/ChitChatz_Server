export const signup = async (req, res) => {
    try {
        const {email, password} = req.body;
    } catch (error) {
        
    }
}

export const login = (req, res) => {
    console.log('loginUser');
}

export const logout = (req, res) => {
    console.log('logoutUser');
}
