var mongoose = require("mongoose");

const CompletedSchema = new mongoose.Schema(
	{
		
		title: { type: String, },
        lang: { type: String, },
       
	},
	{ collection: 'device' }
)



module.exports = mongoose.model('device', CompletedSchema)