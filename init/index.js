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

const categories = [
  "Trending",
  "Room",
  "Iconic Cities",
  "Mountain",
  "Castles",
  "Amazing Pools",
  "Camping",
  "Farms",
  "Arctic",
  "Domes",
  "Boats"
];

const initDB=async ()=>{
    await Listing.deleteMany({});
   data = data.map((obj) => {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return {
    ...obj,
    owner: "68e4e5ea55b9ffcff0f67401",
    geometry: { type: "Point", coordinates: [77.2088, 28.6639] },
    category: randomCategory // ✅ add random category
  };
});

    await Listing.insertMany(data);
    console.log("data is inserted");
};

initDB();