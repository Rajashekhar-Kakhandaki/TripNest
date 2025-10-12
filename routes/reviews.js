const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing");
const {isLoggedIn}=require("../middleware.js");


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body,{abortEarly:false});
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400,errMsg); 
    }else{
        next();
    }
};

router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
 let listing=await Listing.findById(req.params.id);

 let newreview=new Review(req.body.review);
 listing.reviews.push(newreview);
 await newreview.save();
 await listing.save();
 console.log("review is saved");
 req.flash("success","New Review created!");
 res.redirect(`/Listings/${listing._id}`);
}));


router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/Listings/${id}`);
}));

module.exports=router;
