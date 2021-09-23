var mongoose = require("mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const CompletedSchema = new mongoose.Schema(
	{
		
		name: { type: String, required: true },
        url:{type:String,required:true},
        price:{type:Number},
		actual_price:{type:Number},
		keywords:{type:String},
		quantity:{type:String},
		availablity:{type:String},
		description:{type:String},
		sellerid:{type:ObjectId,required:true},


       
	},
	{ collection: 'product' }
)



module.exports = mongoose.model('Product', CompletedSchema)