
const   mongoose  = require("mongoose");

const bankSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bankName:{type:String,required:true},
    bnakAccountNumber:{type:String,required:true},
   

  
},{timestamps:true});
const BankAdd = mongoose.model('BankAdd', bankSchema);

module.exports = BankAdd;