var express 		= require("express")
var router 			= express.Router();
var passport		= require("passport");
var aSync			= require('async');
var nodemailer		= require('nodemailer');
var locus 			= require('locus');
var crypto			= require('crypto')

var User 			= require("../models/user")
var Campground 		= require("../models/campground")

var middlewareObj 	= require("../middleware")


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
});

// ==============================
//			FORGOT PASSWORD
// ==============================

// GET route
router.get("/forgot", function(req, res){
	res.render("forgot");
});

router.post("/forgot", function(req, res){
	aSync.waterfall([
		function(done){
			//console.log("got into the 1st function");
			crypto.randomBytes(20, function(err, buf){
				var token = buf.toString("hex");
				done(err, token);
			});
		}, 
		function(token, done){
			//console.log("got into the 2nd function");
			User.findOne({email: req.body.email}, function(err, user){
				if(!user) {
					req.flash("error", "No account with that email address exists.");
					return res.redirect("/forgot");
				}
				
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
				
				user.save(function(err){
					done(err, token, user);
				});
			});
		},
		function(token, user, done){
			//console.log("got into the 3rd function");
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: "learncode123456@gmail.com",
					pass: "password21."
				}
			});
			
			var mailOptions = {
				to: user.email,
				from: "learncode123456@gmail.com",
				subject: "YelpCamp password reset",
				text: "You are receiving this because you (or someone else) have requested the reset of your password." +
					  "Please click on the following link, or paste this into your browser to complete the process" +
					  "http://" + req.headers.host + "/reset/" + token + '\n\n' +
					  "If you did not request this, please ignore this email and your password will remain unchanged"
			};
			smtpTransport.sendMail(mailOptions, function(err){
				console.log("mail sent");
				req.flash("success", "An e-mail has been sent out to " + user.email + " with further instructions.")
				done(err, "done")
			})
		}
	], function(err){
		if(err) {
			return console.log(err);
		}
		res.redirect("/forgot");
		
	})
});

// Reset password logic
router.get("/reset/:token", function(req, res){
	User.findOne({ resetPasswordToken: req.params.token,
				   resetPasswordExpires : { $gt: Date.now() } }, function(err, foundUser){
		if(!foundUser){
			req.flash("error","Password reset token is invalid or has expired.");
			return res.redirect("/forgot");
		}
		res.render("reset", {token: req.params.token});
	});
});

router.post("/reset/:token", function(req, res){
	aSync.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, 
						   resetPasswordExpires: { $gt: Date.now()}}, function(err, foundUser){
				if (!foundUser){
					req.flash("error", "Passord reset token is invalid or has expired.");
					return res.redirect("back");
				}
				console.log(req.body.password);
				console.log(req.body.confirm);
				console.log(foundUser);
				if(req.body.password === req.body.confirm) {
					foundUser.setPassword(req.body.password, function(err){
						foundUser.resetPasswordToken = undefined;
						foundUser.resetPasswordExpires = undefined;
						
						foundUser.save(function(err){
							req.logIn(foundUser, function(err){
								done(err, foundUser);
							})
						});
					});
				}else{
					req.flash("error", "Passworsd must match.");
					return res.redirect("back");
				}
			});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: "learncode123456@gmail.com",
					pass: "password21."
				} 
			});
			var mailOptions = {
				to:  user.email,
				from:  "learncode123456@gmail.com",
				subject: "Your password has been changed" ,
				text: "Hello, \n\n" +
					  "This is a confirmation that the password for your account " + user.email + " has just been changed.\n"
			};
			smtpTransport.sendMail(mailOptions, function(err){
				req.flash("success", "Success! Your password has been changed.");
				done(err);
			});
		}
	], function(err){
	
		res.redirect("/campgrounds");
	});
});




module.exports = router;