const User=require('../models/user.js')

//signup page
module.exports.signupForm=(req,res)=>{
    res.render('users/signup.ejs')
}

//post req of signup
module.exports.postSignup=async(req,res)=>{
   try{ let {username, email, password}=req.body
    const newUser= new User({email,username});
   const registeredUser= await User.register(newUser,password)
   console.log(registeredUser)

   req.login(registeredUser,(err)=>{  
    if(err){
        return next(err)
    }  
   req.flash('success',"Welcome to BnbAir")
   res.redirect("/listings") }) 
}
   catch(e){
    req.flash("error",e.message)
    res.redirect("/signup")
   }
}

//login get req
module.exports.loginForm=(req,res)=>{
    res.render('users/login.ejs')
}

//login post req
module.exports.loginPost=(req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl; // clean up after use
    res.redirect(redirectUrl);
}

//logout
module.exports.logout=(req,res,next)=>{
  req.logout((err)=>{  
    if(err){
        return next(err)
    }
     req.flash("success","Logged Out Successfully")
  return res.redirect("/listings")
  })
 
}