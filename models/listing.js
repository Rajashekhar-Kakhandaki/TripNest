const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    
     image: {
        type: String,
        default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" : v,
    },
    
    price:{
        type:Number,
        required:true,
        min:[0,"Add valid amount"],
    },

    location:{
        type:String,
        required:true,
    },

    country:{
        type: String,
        required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;