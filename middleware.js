let Listing=require("./models/listing")
const ExpressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require('./schema.js');
const Review = require("./models/review.js");

const isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;     // req.originalUrl is a method which holds full data or URL (we can redirect after login to your last page)
    req.flash("error","you must be logged in to add/edit/delete listing or review")
    return res.redirect("/login")
  }
  next()
})


const saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl) {
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
}

//handles editing/deleting listings using postman
const isOwner=async (req,res,next)=>{
  let { id } = req.params;
    let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","Permission denied!")
   return res.redirect(`/listings/${id}`);
  }
  next()
}

const isReviewAuthor=async (req,res,next)=>{
  let { id,reviewId } = req.params;
    let review=await Review.findById(reviewId );
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","Permission denied!")
   return res.redirect(`/listings/${id}`);
  }
  next()
}

//error handling from serverside(postman)
const validateListing=(req,res,next)=>{          //handle serverside post patch req
     let {error}= listingSchema.validate(req.body);         //schema.js validation from server
  if(error){
    return next(new ExpressError(400,error))        //if title,price or other parameters are missing or review
  }else{ 
   return next()                                //another errors handled by middleware
  }
}

//validate used instead od try and catch
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        return next(new ExpressError(401,error))
    }else{
        return next()
    }
}

module.exports = {isLoggedIn , saveRedirectUrl , isOwner , validateListing , validateReview ,isReviewAuthor};