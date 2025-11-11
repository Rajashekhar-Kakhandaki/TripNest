const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.reviewPostRoute=async(req,res)=>{
 let listing=await Listing.findById(req.params.id).populate({path: "reviews",populate: { path: "author"}});
 let newreview=new Review(req.body.review);
 newreview.author=req.user._id;
 listing.reviews.push(newreview);
 await newreview.save();
 await listing.save();
 console.log("review is saved");
 req.flash("success","New Review created!");
 res.redirect(`/Listings/${listing._id}`);
};


module.exports.destroyReviewRoute=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/Listings/${id}`);
};