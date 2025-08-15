let mongoose= require('mongoose')                            
const Listing = require('../models/listing.js')  //imported model (collection)
const initData=require('./data.js')       //imported inital data from data.js file to add it in model (collection)

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb')
}
main().then(()=>{console.log('Connected to DB')})
.catch((err)=>{console.log(err)})

  
const initDB= async (params) => {
    await Listing.deleteMany({});     //So whole data from collection Listing will deleted from databas.
    initData.data=initData.data.map((info)=>({...info , owner:'688d087a4ada2450479f495e'}))
    await Listing.insertMany(initData.data);    //adds new data which is exported from data.js=initData  there initData.data will give permission to access data from data.js
    console.log("data was initalized")
}

initDB();