var mongoose = require("mongoose");

const CompletedSchema = new mongoose.Schema(
	{
		
		name: { type: String},
        phone:{type:Number,required:true},
        otp:{type:Number},
        password:{type:String},
        verify:{type:Boolean,default:false},
        shop_name: { type: String },
        user_id:{type:String},
        street: { type: String },
        landmark: { type: String},
        place: { type: String },
        dist: { type: String },
        state: { type: String },
        pincode: { type: Number},
	},
	{ collection: 'seller' }
)



module.exports = mongoose.model('Seller', CompletedSchema)