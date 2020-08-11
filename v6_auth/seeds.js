var mongoose = require("mongoose");
var Campground = require("./models/campground")
var Comment = require("./models/comment")


var data = [
	{
		name: "Could's Rest",
		image: "https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in gravida massa, vitae ullamcorper risus. Vivamus justo tellus, faucibus eu massa at, lacinia pretium est. Vivamus ut posuere tortor, sit amet rhoncus tortor. Fusce sit amet vestibulum urna, eu auctor erat. Fusce vitae condimentum orci. Sed lacinia risus felis, sit amet sollicitudin magna sollicitudin nec. Etiam placerat id dui at pretium. Etiam mollis tortor arcu, ut elementum lectus mollis vitae. Sed id massa et quam euismod sollicitudin. Nulla quis arcu condimentum, tempus sem a, commodo velit. Quisque elit magna, blandit in nunc et, luctus finibus est. Integer tempus magna et est efficitur, vitae sodales purus pretium. Nullam vestibulum mi dui, non efficitur ligula rutrum ac. Sed vestibulum porttitor lacus a egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec quis urna sapien. Donec auctor sagittis justo. Cras commodo purus eros, ac convallis tellus pharetra ac. Donec rhoncus faucibus lorem a ultricies. Suspendisse potenti. In hac habitasse platea dictumst. Donec vel blandit lorem, id dictum lorem. Morbi malesuada ut nunc nec fermentum. Donec maximus convallis suscipit. In hac habitasse platea dictumst. Vestibulum pretium id ligula quis dignissim. Duis lacus quam, semper id tortor ultrices, suscipit tempor ante."},
	{
		name: "Desert Mesa", 
		image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in gravida massa, vitae ullamcorper risus. Vivamus justo tellus, faucibus eu massa at, lacinia pretium est. Vivamus ut posuere tortor, sit amet rhoncus tortor. Fusce sit amet vestibulum urna, eu auctor erat. Fusce vitae condimentum orci. Sed lacinia risus felis, sit amet sollicitudin magna sollicitudin nec. Etiam placerat id dui at pretium. Etiam mollis tortor arcu, ut elementum lectus mollis vitae. Sed id massa et quam euismod sollicitudin. Nulla quis arcu condimentum, tempus sem a, commodo velit. Quisque elit magna, blandit in nunc et, luctus finibus est. Integer tempus magna et est efficitur, vitae sodales purus pretium. Nullam vestibulum mi dui, non efficitur ligula rutrum ac. Sed vestibulum porttitor lacus a egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec quis urna sapien. Donec auctor sagittis justo. Cras commodo purus eros, ac convallis tellus pharetra ac. Donec rhoncus faucibus lorem a ultricies. Suspendisse potenti. In hac habitasse platea dictumst. Donec vel blandit lorem, id dictum lorem. Morbi malesuada ut nunc nec fermentum. Donec maximus convallis suscipit. In hac habitasse platea dictumst. Vestibulum pretium id ligula quis dignissim. Duis lacus quam, semper id tortor ultrices, suscipit tempor ante."
	},
	{
		name: "Canyon floor", 
		image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in gravida massa, vitae ullamcorper risus. Vivamus justo tellus, faucibus eu massa at, lacinia pretium est. Vivamus ut posuere tortor, sit amet rhoncus tortor. Fusce sit amet vestibulum urna, eu auctor erat. Fusce vitae condimentum orci. Sed lacinia risus felis, sit amet sollicitudin magna sollicitudin nec. Etiam placerat id dui at pretium. Etiam mollis tortor arcu, ut elementum lectus mollis vitae. Sed id massa et quam euismod sollicitudin. Nulla quis arcu condimentum, tempus sem a, commodo velit. Quisque elit magna, blandit in nunc et, luctus finibus est. Integer tempus magna et est efficitur, vitae sodales purus pretium. Nullam vestibulum mi dui, non efficitur ligula rutrum ac. Sed vestibulum porttitor lacus a egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec quis urna sapien. Donec auctor sagittis justo. Cras commodo purus eros, ac convallis tellus pharetra ac. Donec rhoncus faucibus lorem a ultricies. Suspendisse potenti. In hac habitasse platea dictumst. Donec vel blandit lorem, id dictum lorem. Morbi malesuada ut nunc nec fermentum. Donec maximus convallis suscipit. In hac habitasse platea dictumst. Vestibulum pretium id ligula quis dignissim. Duis lacus quam, semper id tortor ultrices, suscipit tempor ante."
	},
	{
		name: "Dracula's Nest", 
		image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in gravida massa, vitae ullamcorper risus. Vivamus justo tellus, faucibus eu massa at, lacinia pretium est. Vivamus ut posuere tortor, sit amet rhoncus tortor. Fusce sit amet vestibulum urna, eu auctor erat. Fusce vitae condimentum orci. Sed lacinia risus felis, sit amet sollicitudin magna sollicitudin nec. Etiam placerat id dui at pretium. Etiam mollis tortor arcu, ut elementum lectus mollis vitae. Sed id massa et quam euismod sollicitudin. Nulla quis arcu condimentum, tempus sem a, commodo velit. Quisque elit magna, blandit in nunc et, luctus finibus est. Integer tempus magna et est efficitur, vitae sodales purus pretium. Nullam vestibulum mi dui, non efficitur ligula rutrum ac. Sed vestibulum porttitor lacus a egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec quis urna sapien. Donec auctor sagittis justo. Cras commodo purus eros, ac convallis tellus pharetra ac. Donec rhoncus faucibus lorem a ultricies. Suspendisse potenti. In hac habitasse platea dictumst. Donec vel blandit lorem, id dictum lorem. Morbi malesuada ut nunc nec fermentum. Donec maximus convallis suscipit. In hac habitasse platea dictumst. Vestibulum pretium id ligula quis dignissim. Duis lacus quam, semper id tortor ultrices, suscipit tempor ante."
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

