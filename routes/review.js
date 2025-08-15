const express=require('express')
const router=express.Router({mergeParams:true})   //so setting {mergeParams:true} this will access actual id's from app.js   {this and below 2lines}
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn, isReviewAuthor}=require('../middleware.js')
const reviewController=require('../controller/review.js')

//review post route
router.post('/', isLoggedIn ,validateReview,wrapAsync(reviewController.postReview))

//review Delete route
router.delete('/:reviewId',isLoggedIn, isReviewAuthor ,wrapAsync(reviewController.deleteReview))

module.exports=router;
