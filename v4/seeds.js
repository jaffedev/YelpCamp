var mongoose = require("mongoose");
var Campground = require("./models/campground")
var Comment = require("./models/comment")


var data = [
	{
		name: "Could's Rest",
		image: "https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description:"blah blah blah blah blah"},
	{
		name: "Desert Mesa", 
		image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description: "blah blah blah blah blah"
	},
	{
		name: "Canyon floor", 
		image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description: "This is a post about Canyon Floor"
	},
	{
		name: "Dracula's Nest", 
		image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description: "This is a post about a wonderful camping place"
	}
]

function seedDB(){
	// Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds");
		// Add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				}else{
					console.log("Added a campground!!")
					Comment.create(
						{
							text:"this plaxce is great but I wish there was internet",
							author:"I_love_cats" 
						}, function(err, comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created a new comment")
							}
							
						}
					)
				}
			})
		})
	})
	
	
	// Add a few comments
}

module.exports = seedDB;

