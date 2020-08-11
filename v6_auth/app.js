var express     	= require("express");
var app 			= express();
var bodyParser 		= require("body-parser");
var mongoose 		= require("mongoose");
var passport		= require("passport");
var LocalStrategy 	= require("passport-local")
var Campground 		= require("./models/campground")
var Comment 		= require("./models/comment")
var User 			= require("./models/user")
var seedDB			= require("./seeds")



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp_v6")


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");

seedDB();

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
	next();
})


// =============================
//	CAMPGROUND ROUTES 
// =============================

app.get("/", function(req, res){
	res.render("landing");
});

// INDEX route - show all campgrounds
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
})

// SHOW route - Display information about a specific campground with id
app.get("/campgrounds/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground:foundCampground});
		}
	})
});

// ===============================
// 			COMMENT ROUTES
// ===============================


// NEW route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	// lookup campground usind ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			// create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// redirect to campground show page
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	})
	
	
	
})

// ===============================
// 			AUTH ROUTES
// ===============================

// show SIGN UP form 
app.get("/register", function(req, res){
	res.render("register");
});

// Handle SIGN UP logic
app.post("/register", function(req, res){
	//res.send("Signing you up");
	var newUser = new User({username: req.body.username});
	console.log(newUser);
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
				 
	
});

// Show LOGIN form
app.get("/login", function(req, res){
	res.render("login");
})


						  

// Handle LOGIN logic
// app.post("/login", middleware, callback)
app.post("/login", 
		passport.authenticate("local",
							  {successRedirect:"/campgrounds",
							  failureRedirect:"/login"}),
		function(req, res){
});

// Logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
})


//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



app.listen(3000, function(){
	console.log("The yelpcamp server has started!!!")
});