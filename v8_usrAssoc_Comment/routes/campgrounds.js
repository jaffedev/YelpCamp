var express = require("express");
var router = express.Router();

var Campground = require("../models/campground")
var Comment = require("../models/comment")


// =============================
//	CAMPGROUND ROUTES 
// =============================

// INDEX route - show all campgrounds
router.get("/", function(req, res){
	// Get all the campgrounds from DB
	var campgrounds = Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			//res.send("this is the campgrounds page")
			res.render("campgrounds/index", {campgrounds:campgrounds, currentUser: req.user});
		}
	})
});

// CREATE route - add a new campground to the DB
router.post("/", isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var campgroundName = req.body.name;
	var campgroundImg = req.body.image;
	var campgroundDesc = req.body.desc;
	var campgroundObject = {name: campgroundName, image: campgroundImg, description: campgroundDesc} ;
	
	Campground.create(campgroundObject, function(err, newCampground){
		if(err){
			console.log(err);
		}else{
			// redirect to campgrounds page
			res.redirect("/campgrounds");
		}
	})
	//campgrounds.push(campgroundObject);	
})

// NEW route - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})

// SHOW route - Display information about a specific campground with id
router.get("/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground:foundCampground});
		}
	})
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router