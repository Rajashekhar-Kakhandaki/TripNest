const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing");
const {isLoggedIn,validateReview,isOwner,isReviewAuthor}=require("../middleware.js");
const { isObjectIdOrHexString } = require("mongoose");
const reviewController=require("../controllers/reviews.js");



//review post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.reviewPostRoute));

//destroy review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReviewRoute));

module.exports=router;
