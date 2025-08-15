const express=require('express')
const router=express.Router({mergeParams:true}) 
const wrapAsync = require('../utils/wrapAsync.js')
const passport=require('passport')
const {saveRedirectUrl}=require('../middleware.js')
const userController=require('../controller/user.js')

//signup
router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.postSignup))

//login
router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,
passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),   userController.loginPost);

//logout user
router.get('/logout',userController.logout)

module.exports=router;