const mongoose=require("mongoose");
let data=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("conneted to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
};

const initDB=async ()=>{
    await Listing.deleteMany({});
    data= data.map((obj)=>({...obj,owner:"68e4e5ea55b9ffcff0f67401",geometry: { type: "Point", coordinates: [77.2088, 28.6639]}}));
    await Listing.insertMany(data);
    console.log("data is inserted");
};

initDB();