const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//Index Route
//new Post Route
router
.route("/")
.get( wrapAsync(listingController.indexRoute))
.post(validateListing,upload.single("listing[image]"), wrapAsync(listingController.newListingPostRoute));

//new route
router.get("/new", isLoggedIn, listingController.newListingRoute);

//show Route
//edit put Route
//destroy Route
router
.route("/:id")
.get( wrapAsync(listingController.showListingRoute))
.put( isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.editListingPutRoute))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListingRoute));



//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingRoute));


module.exports = router;
