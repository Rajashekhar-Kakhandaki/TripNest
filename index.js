const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");


const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const sessionOptions={
    secret:"mySuperScrete",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main()
.then(()=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log(err);
});

async function  main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
};

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; 
    next();
});

// app.get("/demoUser",async(req,res)=>{
//     let newUser=new User({
//         email:"raj@gmail.com",
//         username:"Raj"
//     });
//    let registedUser=await User.register(newUser,"helloWorld");
//    res.send(registedUser);
// })

app.use("/Listings",listingsRouter);
app.use("/Listings/:id/review",reviewsRouter);
app.use("/",userRouter);

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

function handleValidationErr(err){
    console.log(err.message)
    console.log("This was validation error.Please follow the rules");
    return err;
 }

app.use((err,req,res,next)=>{
    console.log(err.message);
    if(err.name==="ValidationError"){
        err=handleValidationErr(err);

    }
    let{status=500,message="something went wrong"}=err;
    res.status(status).render("Error.ejs",{message});
    // return res.status(status).send(message);
});

app.listen(3000,()=>{
    console.log("app is listening on port 3000");
});
