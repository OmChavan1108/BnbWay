if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express=require('express')
const app=express();
const mongoose=require('mongoose')
let path=require('path')
let methodOverride=require('method-override')
const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/expressError.js");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const passportLocal=require('passport-local')
const User=require("./models/user.js")

const listingRouter=require("./routes/listing.js")   //for using routing which is stored here and access by app.use below
const reviewRouter=require("./routes/review.js"); //for using routing which is stored here and access by app.use below
const userRoute=require('./routes/user.js');
const { error } = require('console');

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.static(path.join(__dirname,'public')));    //style.css and script.js
app.use(express.urlencoded({extended:true}))         //url 
app.use(methodOverride('_method'));   //patch delete
app.engine('ejs', ejsMate);                       // use ejs-locals for all ejs templates:{boilerplate.ejs}

let Atlas_DB=process.env.AtlasDb_URL;

async function main() {
    await mongoose.connect(Atlas_DB)
}
main().then(()=>{console.log('Connected to DB')})
.catch((err)=>{console.log(err)})


//Session middleware (MUST come before flash & passport)

const store = MongoStore.create({
    mongoUrl:Atlas_DB,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter:24 * 3600
})

store.on("error",(err)=>{
    console.log("Error",err)
})

const sessionOptions={
    store,
  secret: process.env.SECRET,         
   resave: false,
   saveUninitialized: true,
   cookie:{                //because of this setting, it will store cookies in our s-id and no need to do login again and again it will kept login and store data for given period
    //expires:Date.now() + 1000 * 60 * 60 * 24 * 3,     //we can use maxage or this same work for both
    maxAge: 1000 * 60 * 60* 24 * 3,           // cookie to expire after 3 days.
    httpOnly: true,                  // Prevents client-side JS from accessing the cookie                                
   }
}

app.use(session(sessionOptions))         //you can see genreated sessionid in cookies(will hold info of cookies)
app.use(flash())              //must be use before listing and reviews   {see app.use(res.locals)}

// passports
app.use(passport.initialize())   
app.use(passport.session())                //So this will store login info in your Session so not need to login till session id got expire.
passport.use(new passportLocal(User.authenticate()))   //navin document tayar honar User model madi tejat passport cha methods asnar
passport.serializeUser(User.serializeUser());    //info related to user is stored in session.
passport.deserializeUser(User.deserializeUser());  //info related to users are removed from session once it is expire.

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');     //req.flash(name)  this will store value define in listings post
    res.locals.error=req.flash('error');        //so if in our route req.flash(error,"value") then this value will get store in error and in ejs we can use error on our page
    res.locals.currUser=req.user;
    next();    //imp to go to /listings
})

app.get('/',(req,res)=>{     //so router is going to come in role after /listing. So this is not placed in there{/}
    res.render('listings/home.ejs')
})

app.use("/listings",listingRouter)   //all listings are in routes folder listing.js
app.use("/listings/:id/reviews",reviewRouter)    //all review are in routes folder review.js
app.use("/",userRoute)

// app.get("/demo", async (req, res) => {
//     let fakeuser = new User({
//         email: "siddhi@gmail.com",
//         username: "siddhi"
//     });

//     let registered = await User.register(fakeuser, "Newassword");
//     res.send(registered);
// });

app.use( (req, res, next) => {
   return next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Default message"}=err
    res.status(statusCode).render('users/error.ejs',{message})
    //res.status(statusCode).send(message)
})

app.listen(8080,()=>{
    console.log('Connected to port 8080')
})

