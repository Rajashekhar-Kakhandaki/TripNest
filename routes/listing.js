const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn}=require("../middleware.js");


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error.details);
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};





router.get("/", wrapAsync(async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("Listings/index.ejs", { AllListings });

}));

//new route
router.get("/new",isLoggedIn, (req, res) => {
        // console.log(req.user);
        // if (!req.isAuthenticated()) {
        //     req.flash("error", "You must be logged in to create a Listing!");
        //     return res.redirect("/login");
        // }
        res.render("Listings/new.ejs");
});



router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newList = new Listing(req.body.listing);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success", "New Listing created!");
    res.redirect("/Listings");
}));


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/Listings");
    }
    res.render("Listings/show.ejs", { listing });
}));



//edit route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/Listings");
    }
    res.render("Listings/edit.ejs", { listing });
}));




router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editedList = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...editedList });
    req.flash("success", "Listing Updated!");
    res.redirect(`/Listings/${id}`);
}));



router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/Listings");
}));




module.exports = router;
