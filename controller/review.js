let Review=require("../models/review.js")        //app.js we used app.use("/listings/:id/reviews",reviews)   
let Listing=require("../models/listing.js")    //so because of this we will find actual id

//post review
module.exports.postReview=async (req,res)=>{
  let listing=await Listing.findById(req.params.id)
  let review=new Review(req.body.review) //req ali aahe body madi tejatle reviews kadto ani Review model madi store karto
  review.author=req.user._id;

  listing.reviews.push(review)   //listing apun Listing collection madun id cha help in find keli ani reviews cha push kela review

  await review.save()     //Review collection madi add kela save kela
  await listing.save()    //Listing madi reviews cha id add kelay 
   req.flash("success","You created new review for this listing Successfully!")
  res.redirect(`/listings/${listing._id}`)
}

//delete review
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
     req.flash("error","Review Deleted Successfully!")
    res.redirect(`/listings/${id}`)
}