var express = require("express");
var router = express.Router();

var Campground = require("../models/campground")
var Comment = require("../models/comment")

var middlewareObj = require("../middleware")

var NodeGeocoder = require('node-geocoder');

var options = {
	provider: "google",
	httpAdapter: "https",
	apiKey: "AIzaSyAgEBsf-S-A5NVAlyzeNE1ZEhVVJn3fTKk",
	formatter: null
};

var geocoder = NodeGeocoder(options);


// =============================
//	CAMPGROUND ROUTES 
// =============================

// INDEX route - show all campgrounds
router.get("/", function(req, res){
	// v18 : fuzzy search 
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err, allCampgrounds){
			if(err){
				console.log(err);
			}else{
				res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds', currentUser: req.user});
			}
		})
		
	} else {
		// Get all the campgrounds from DB
		Campground.find({}, function(err, allCampgrounds){
			if(err){
				console.log(err);
			}else{
				res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds', currentUser: req.user});
			}
		})
	}
});

// CREATE route - add a new campground to the DB
router.post("/", middlewareObj.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var campgroundName = req.body.name;
	var campgroundPrice = req.body.price;
	var campgroundImg = req.body.image;
	var campgroundDesc = req.body.desc;
	var campgroundAuthor = {
		id: req.user._id,
		username: req.user.username
	}
	
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length) {
			console.log(err.message);
			req.flash('error', "Invalid address");
			return res.redirect("back");
		}
		
		var campgroundLat = data[0].latitude;
		var campgroundLng = data[0].longitude;
		var campgroundLoc = data[0].formattedAddress;
	
		var campgroundObject = {name: campgroundName,
								price: campgroundPrice,
								image: campgroundImg, 
								description: campgroundDesc,
						    	author: campgroundAuthor,
						   		location: campgroundLoc,
								lat: campgroundLat,
								lng: campgroundLng
						   		} ;
	
		Campground.create(campgroundObject, function(err, newCampground){
			if(err){
				console.log(err);
			}else{
				// redirect to campgrounds page
				res.redirect("/campgrounds");
			}
		});
	});
});

// NEW route - show form to create new campground
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
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

// EDIT route - Show form to update a campgrounds
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
	console.log("AUTHORIZATION GRANTED");
	Campground.findById(req.params.id, function(err, foundCampground){
		console.log("CAMPGROUND FOUND")
		console.log(foundCampground)
		res.render("campgrounds/edit", {campground: foundCampground}); 
	}); 
});


//UPDATE route
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
	geocoder.geocode(req.body.location, function(err, data){
		if (err || !data.length) {
			req.flash('error', "Invalid address");
			return res.redirect("back");
		}
		
		// find and update the correct campground
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
			if(err){
				res.redirect('/campgrounds');
			} else{
				// redirect to the show page
				console.log(updatedCampground);
				req.flash('succes', "Campground successfully updated!")
				res.redirect("/campgrounds/" + req.params.id)
			}
		});	
	}); 
});

//DESTROY route - delete a campground with a particular id
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
})


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router