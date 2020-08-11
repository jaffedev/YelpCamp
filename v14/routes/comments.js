var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground")
var Comment = require("../models/comment")

var middlewareObj = require("../middleware")

// ===============================
// 			COMMENT ROUTES
// ===============================


// NEW route
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
	// find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	})
	
})

//CREATE route
router.post("/", middlewareObj.isLoggedIn, function(req, res){
	// lookup campground usind ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error","Something went wrong!")
			res.redirect("/campgrounds");
		}else{
			// create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save()
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// redirect to campground show page
					req.flash("succes", "Successfully added a new comment!")
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		};
	});	
});

// EDIT route
router.get("/:commentId/edit", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.commentId, function(err, foundComment){
		if(err){
			res.redirect("/campgrounds/" + req.params.id)
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
	
})

// UPDATE route
router.put("/:commentId", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){ 
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment successfully updated!")
			res.redirect("/campgrounds/"+ req.params.id)
		}
	})
	
})

// DESTROY route
router.delete("/:commentId", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.commentId, function(err){
		if(err){
			reeq.flash("error", "Oops! Something went wrong, your comment could not be deleted!")
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			req.flash("success", "Comment successfully deleted!")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
})


module.exports = router