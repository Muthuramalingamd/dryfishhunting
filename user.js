var mongoose = require("mongoose");

const CompletedSchema = new mongoose.Schema(
	{
		
		name: { type: String, required: true },
        phone:{type:Number,required:true},
        otp:{type:Number},
        password:{type:String},
        verify:{type:Boolean,default:false},
	},
	{ collection: 'user' }
)



module.exports = mongoose.model('User', CompletedSchema)