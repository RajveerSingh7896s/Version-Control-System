const express = require("express") ;

const userController = require("../controllers/userController") ;
const userRouter = express.Router() ;

userRouter.get("/allUsers",userController.getAllUser);
userRouter.post("/login",userController.login);
userRouter.post("/signup",userController.signup);
userRouter.get("/userProfile",userController.getUserProfile);
userRouter.put("/updateProfile",userController.updateUserProfile);
userRouter.delete("/deleteProfile",userController.deleteUserProfile);

module.exports = userRouter ;