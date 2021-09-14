var mongoose = require("mongoose");

const CompletedSchema = new mongoose.Schema(
	{
		
		name: { type: String, required: true },
        url:{type:String,required:true},
        price:{type:Number},
       
	},
	{ collection: 'product' }
)



module.exports = mongoose.model('Product', CompletedSchema)