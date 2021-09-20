var mongoose = require("mongoose");

const CompletedSchema = new mongoose.Schema(
	{
		
		name: { type: String, required: true },
        phone:{type:Number,required:true},
        otp:{type:Number},
        password:{type:String},
        verify:{type:Boolean,default:false},
        shop_name: { type: String, required: true },
        user_id:{type:String,required:true},
        street: { type: String, required: true },
        landmark: { type: String, required: true },
        place: { type: String, required: true },
        dist: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: Number, required: true },
	},
	{ collection: 'seller' }
)



module.exports = mongoose.model('Seller', CompletedSchema)