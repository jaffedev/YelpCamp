var express 	= require("express");
var app 		= express();
var bodyParser 	= require("body-parser");
var mongoose 	= require("mongoose")
var Campground 	= require("./models/campground")
var seedDB		= require("./seeds")



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp_v3")


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();

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
			res.render("index", {campgrounds:campgrounds});
		}
	})
	//res.render("campgrounds", {campgrounds:campgrounds});	
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
	res.render("new");
})

// SHOW - Display information about a specific campground with id
app.get("/campgrounds/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("show", {campground:foundCampground});
		}
	})
	// render show template with that campground
	//res.render("show");
	//res.send("THIS WILL BE THE SHOW PAGE ONE DAY!!");
});


app.listen(3000, function(){
	console.log("The yelpcamp server has started!!!")
});