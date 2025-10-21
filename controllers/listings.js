const Listing=require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: mapToken });

module.exports.indexRoute=async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("Listings/index.ejs", { AllListings });

};

module.exports.newListingRoute=(req, res) => {
    res.render("Listings/new.ejs");
};

module.exports.newListingPostRoute=async (req, res) => {

    let responce=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit:1
    }).send();
    let url=req.file.path;
    let filename=req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image={url,filename};
    newList.geometry=responce.body.features[0].geometry;
    let savedlisting=await newList.save();
    console.log(savedlisting);
    req.flash("success", "New Listing created!");
    res.redirect("/Listings");
};

module.exports.showListingRoute=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/Listings");
    }
    res.render("Listings/show.ejs", { listing });
};

module.exports.editListingRoute=async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/Listings");
    }
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/w_250");
    res.render("Listings/edit.ejs", { listing,originalimageurl });
};

module.exports.editListingPutRoute=async (req, res) => {
    let responce=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit:1
    }).send();
    let { id } = req.params;
    let editedList = req.body.listing;
    editedList.geometry=responce.body.features[0].geometry;

    let listing=await Listing.findByIdAndUpdate(id, { ...editedList});
    if(typeof req.file != "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        // listing.geometry=responce.body.features[0].geometry;
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/Listings/${id}`);
};

module.exports.destroyListingRoute=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/Listings");
};