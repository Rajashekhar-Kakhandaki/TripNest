const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
const dbUrl=process.env.ATLASDB_URL




const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const mongoStore=require("connect-mongo");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const User=require("./models/user.js");
const ExpressError=require("./utils/ExpressError.js");


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("Error in Mongo Session store",err)
});
const sessionOptions={
    // store:store,
    secret:process.env.SECRET,
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



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; 
    next();
});

main()
.then(()=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log(err);
});
// "mongodb://127.0.0.1:27017/airbnb"

async function  main() {
    await mongoose.connect(dbUrl);
};



app.get("/",async(req,res)=>{
   const AllListings = await Listing.find({});
    res.render("Listings/index.ejs", { AllListings });

});
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
    // console.log(err.message);
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
