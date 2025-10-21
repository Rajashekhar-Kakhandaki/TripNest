const User=require("../models/user.js");

module.exports.signUpGetRoute=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUpPostRoute=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        let registeredUsr=await  User.register(newUser,password);
        req.login(registeredUsr,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to TripNest");
            res.redirect("/Listings");
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
};

module.exports.logInGetRoute=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logInPostRoute=(req,res)=>{
    req.flash("success","Welcome back to TripNest")
    let redirectUrl=res.locals.redirectUrl || "/Listings"
    res.redirect(redirectUrl);
};

module.exports.logOutRoute=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/Listings");
    });
};