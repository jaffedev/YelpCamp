var GEOCODER_API_KEY = "AIzaSyAgEBsf-S-A5NVAlyzeNE1ZEhVVJn3fTKk"
var express     	= require("express");
var app 			= express();
var bodyParser 		= require("body-parser");
var mongoose 		= require("mongoose");
var flash 			= require("connect-flash");
var passport		= require("passport");
var LocalStrategy 	= require("passport-local");
var methodOverride	= require("method-override");
var Campground 		= require("./models/campground");
var Comment 		= require("./models/comment");
var User 			= require("./models/user");
var seedDB			= require("./seeds");

var campgroundRoutes 	= require("./routes/campgrounds");
var commentRoutes 		= require("./routes/comments");
var authRoutes 			= require("./routes/index.js");
var userRoutes			= require("./routes/users")



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp_v14")


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //seed the database

// Moment JS
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret : "David is my best friend",
	resave: false,
	saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.errorMsg = req.flash("error");
	res.locals.successMsg = req.flash("success");
	next();
})

app.use(authRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/users', userRoutes);



app.listen(3000, function(){
	console.log("The yelpcamp server has started!!!")
});