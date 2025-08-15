const Listing=require('../models/listing')

//Listing index route (show all hotels title with img)
module.exports.index=async (req,res)=>{     //using async and await is imp because mongoose methos eg find() always returns a promise which is async
   let allListings= await Listing.find({})      //It will stop execution till this Listing.find({}) is resolved
res.render('listings/index.ejs',{allListings})    //if async and await is not use JS starts the find() query But does not wait for it to finishImmediately goes to res.render() allListings here is still a pending Promise Result → EJS gets a Promise, not the real data, so it throws not iterable error
}

//new route  (shows form to enter new listing info)
module.exports.newRoute=(req,res)=>{
    res.render("listings/new.ejs")
}

//fetch form new route and add on listing page
module.exports.newListing=async (req, res,next) => {
    let url=req.file.path
    let filename=req.file.filename
    let { title, description, price, location, country } = req.body;
    let newlistings = new Listing({title, description,image: {url , filename},price,location,country });
    newlistings.owner=req.user._id;
    await newlistings.save();                            // awaits require async
    req.flash("success","You created new listing Successfully!")      //So npm pacakage is isntalled in app.js 
    res.redirect("/listings");
}

//show route
module.exports.showListing=async (req,res)=>{
    let {id}=req.params
    let listing=await Listing.findById(id).populate({
        path:'reviews',
        populate:{path:"author"}
    }).populate('owner')

     if(!listing){
    req.flash("error","This listing does not exist!")     
    return res.redirect("/listings");
   }
   res.render('listings/show.ejs',{listing})
}

//edit route (form)
module.exports.editListing=async (req,res)=>{
    let {id}=req.params
    let listing= await Listing.findById(id)
     if(!listing){
    req.flash("error","This listing does not exist!To edit")     
    return res.redirect("/listings");
   }
   let orginalImage=listing.image.url;
   orginalImage1=orginalImage.replace('/upload','/upload/h_250,w_250')
    res.render('listings/edit.ejs',{listing , orginalImage1})
}

//actual update
module.exports.updatedListing=async (req, res) => {
  let { id } = req.params;
  let { title, description,  price, location, country } = req.body;
 let listing= await Listing.findByIdAndUpdate(id, { title, description, price,location,country});

   if(typeof req.file !== "undefined"){
  let url=req.file.path
  let filename=req.file.filename
  listing.image= {url , filename}
  await listing.save();
 }
  req.flash("success","listing Updated Successfully!")
  res.redirect(`/listings/${id}`);
}

//delete route
module.exports.deleteListing=async (req,res)=>{
    let { id } = req.params;
    console.log(id)
    await Listing.findByIdAndDelete(id)
    req.flash("error","Listing Deleted Successfully!")
    res.redirect('/listings')
}
