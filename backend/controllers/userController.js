const getAllUser = (req,res) => {
    res.send("ALL USERS FETCHED...") ;
}

const signup = (req,res) => {
    res.send("USER SIGNING UP...") ;
}

const login = (req,res) => {
    res.send("USER LOGGING IN...") ;
}

const getUserProfile = (req,res) => {
    res.send("GETTING USER PROFILE...") ;
}

const updateUserProfile = (req,res) => {
    res.send("UPDATING USER PROFILE....") ;
}

const deleteUserProfile = (req,res) => {
    res.send("DELETING USER PROFILE...") ;
}

module.exports = {
    getAllUser,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}