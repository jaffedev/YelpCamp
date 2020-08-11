var mongoose = require("mongoose");


var commentSchema = mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String	
	},
	createdAt: { type: Date, deefault: Date.now}
	
})



module.exports = mongoose.model("Comment", commentSchema);