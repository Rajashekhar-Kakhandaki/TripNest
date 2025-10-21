const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");

router
.route("/signup")
.get(userController.signUpGetRoute)
.post(wrapAsync(userController.signUpPostRoute))


router
.route("/login")
.get(userController.logInGetRoute)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.logInPostRoute);



router.get("/logout",userController.logOutRoute);


module.exports=router;