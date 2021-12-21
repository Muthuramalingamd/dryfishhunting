var mongoose = require("mongoose");

const CompletedSchema = new mongoose.Schema(
	{
		
		title: { type: String, },
        image:{type:String,},
        description: { type: String, },
        published_date: { type: String,},
        url: { type: String,},
        created_on: { type: Date  }
       
	},
	{ collection: 'cinima_eng' }
)



module.exports = mongoose.model('cinima_eng', CompletedSchema)