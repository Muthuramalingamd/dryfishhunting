var mongoose = require("mongoose");

const CompletedSchema = new mongoose.Schema(
	{
		
		name: { type: String, required: true },
        user_id:{type:String,required:true},
        street: { type: String, required: true },
        landmark: { type: String, required: true },
        place: { type: String, required: true },
        dist: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: Number, required: true },
       
	},
	{ collection: 'address' }
)



module.exports = mongoose.model('Adress', CompletedSchema)