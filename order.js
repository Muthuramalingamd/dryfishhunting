var mongoose = require("mongoose");
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const CompletedSchema = new mongoose.Schema(
	{
		
		product_id: { type: ObjectId, required: true },
        address_id: { type: ObjectId, required: true },
        seller_id: { type: ObjectId, required: true },
        created_on:{type:Date,required:true},
        user_id:{type:ObjectId,required:true},
        weight:{type:String},
       
	},
	{ collection: 'order' }
)



module.exports = mongoose.model('Order', CompletedSchema)