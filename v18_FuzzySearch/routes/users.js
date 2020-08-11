var express = require("express")
var router = express.Router({mergeParams: true});
var passport = require("passport");
var locus = require('locus');

var User = require("../models/user");
var Campground = require("../models/campground")

var middlewareObj = require("../middleware");


// SHOW PAGE - User profile
router.get("/:userId", function(req, res){
	User.findById(req.params.userId, function(err, foundUser){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("back");
		}
		Campground.find().where("author.id").equals(foundUser._id).exec(function(err, foundCampgrounds){
			if(err){
				console.log(err);
				req.flash("error", err.message);
				res.redirect("back");
			}
			res.render("users/show", {user: foundUser, campgrounds: foundCampgrounds});
		});
	});
});

module.exports = router