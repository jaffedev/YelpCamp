var express = require("express")
var router = express.Router();
var passport = require("passport");

var User = require("../models/user")

var middlewareObj = require("../middleware")


// root route
router.get("/", function(req, res){
	res.render("landing");
});


// ===============================
// 			AUTH ROUTES
// ===============================

// show SIGN UP form 
router.get("/register", function(req, res){
	res.render("register");
});

// Handle SIGN UP logic
router.post("/register", function(req, res){
	//res.send("Signing you up");
	var newUser = new User({username: req.body.username});
	console.log(newUser);
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
				 
	
});

// Show LOGIN form
router.get("/login", function(req, res){
	res.render("login");
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