var express = require("express")
var router = express.Router();
var passport = require("passport");
var locus = require('locus');

var User = require("../models/user")
var Campground = require("../models/campground")

var middlewareObj = require("../middleware")


// root route
router.get("/", function(req, res){
	Campground.find({}, function(err, foundCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("landing",{campgrounds: foundCampgrounds});
		}
	})
});


// ===============================
// 			AUTH ROUTES
// ===============================

// show SIGN UP form 
router.get("/register", function(req, res){
	res.render("register", {page: "register"});
});

// Handle SIGN UP logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username,
							firstName: req.body.firstName, 
							lastName: req.body.lastName,
							email: req.body.email,
							avatar: req.body.avatar});
	if(req.body.adminCode === 'secretcode123'){
		newUser.isAdmin = true;
	}
	console.log(newUser);
	User.register(newUser, req.body.password, function(err, user){
		console.log("registering user");
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local",{successRedirect:"/campgrounds",
							  failureRedirect:"/register",
							  failureFlash: true,
							  successFlash: "Welcome to YelpCamp " + user.username + "!"})(req, res, function(){
		});
	});
				 
	
});

// Show LOGIN form
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
})

// Handle LOGIN logic
// router.post("/login", middleware, callback)
router.post("/login",
		passport.authenticate("local",
							  {successRedirect:"/campgrounds",
							  failureRedirect:"/login",
							  failureFlash: true}),
		function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You are successfully logged out!")
	res.redirect("/campgrounds");
})


module.exports = router;