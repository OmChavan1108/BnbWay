const express=require('express')
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require('../middleware.js')
const listingController=require('../controller/listing.js')
const multer  = require('multer')
const {storage}=require('../utils/cloudnary.js')
const upload = multer({storage })

router.route("/")
.get(wrapAsync(listingController.index)) //the logic is in controller/listing and explore index func /index Route (show all hotels title with img)
.post(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.newListing)); //fetch form new route and add on listing page


//new route  (shows form to enter new listing info)      {order should be this only}
router.get("/new",isLoggedIn,listingController.newRoute)   // /new should be written before :/id route otherwise it will treat /new as id

router.route("/:id")
.get(wrapAsync(listingController.showListing)) //show Route  (shows)
.patch(isLoggedIn,isOwner,upload.single('image'),validateListing,wrapAsync( listingController.updatedListing))  //update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))    //delete route

//edit route page
router.get('/:id/edit',isLoggedIn,wrapAsync(listingController.editListing))

module.exports=router