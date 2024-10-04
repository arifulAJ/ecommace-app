
const   mongoose  = require("mongoose");

const withdrowSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bankName:{type:String,required:true},
    bnakAccountNumber:{type:String,required:true},
    withdrowAmount:{type:Number,required:false},
    status:{type:String,required:true,enum: ["pending","aproved","cancel"],default:"pending"}

  
},{timestamps:true});
const Withdrow = mongoose.model('Withdrow', withdrowSchema);

module.exports = Withdrow;