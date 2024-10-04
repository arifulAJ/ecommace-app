const mongoose  = require("mongoose");


const cardSchema=new mongoose.Schema({
    image: { type: Object, required: true, default: { publicFileUrl: "/images/users/user.png", path: "public\\images\\users\\user.png" } },
    cardOwaner:{type:String, required:true,},
    cardNumber:{type:String,required:true},
    expiry:{type:String,required:true},
    cvv:{type:String, required:true}
})

const Card=mongoose.model('Card',cardSchema)
module.exports =Card