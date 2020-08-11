// All the middleware goes here
var Campground = require("../models/campground")
var Comment = require("../models/comment")
						 
var middlewareObject = {};

middlewareObject.checkCampgroundOwnership =  function(req, res, next) {
	 // is user logged in
	 // console.log("ENTERING THE MIDDLEEWARE FUNCTION");
	if(req.isAuthenticated()){
		// console.log("User is authenticated");
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back");
			} else {
				//does user own the campgrounds
				// console.log(foundCampground.author.id) // this is an object
				// console.log(req.user._id) // this is a string
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
				
			}
		});
	} else {
		// console.log("USer has not been authenticated");
		res.redirect("back");
	}		 
 };
	
middlewareObject.checkCommentOwnership = function(req, res, next) {
	 // is user logged in
	 // console.log("ENTERING THE MIDDLEWARE FUNCTION");
	if(req.isAuthenticated()){
		// console.log("User is authenticated");
		Comment.findById(req.params.commentId, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				//does user own the comments
				// console.log(foundComment.author.id) // this is an object
				// console.log(req.user._id) // this is a string
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
				
			}
		});
	} else {
		// console.log("User has not been authenticated");
		res.redirect("back");
	}	 
 };
	
middlewareObject.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = middlewareObject