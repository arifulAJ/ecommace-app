const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [ true, "Name is required"], minlength: 3, maxlength: 30, },
    email: {
        type: String, required: [true, "Email is required"], minlength: 3, maxlength: 30, trim: true,
        unique: [true, 'Email should be unique'],
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
            },
            message: 'Please enter a valid Email'
        }
    },
    password: {
        type: String,
        required: false,
        trim: true,
        minlength: 8,
        validate(value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error(
              "Password must contain at least one letter and one number"
            );
          }
        },
      },
    dateOfBirth: { type: String, required: false},
    fcmToken:{type:String,required:false},
    // currentLocation:{type:mongoose.Schema.Types.ObjectId,ref:"Location", required:false},
    currentLocation:{type:Object,required:false},
    boutiquePersentage:{type:Number,required:false ,default:0},
    phone: { type: String, required: false ,default:"9123234234"},
    address: { type: String, required: false,default:"adress" },
    city: { type: String, required: false, default:"city" },
    rate:{type:String,required:false,default:"$$"},
    rating:{type:String,required:false,default:"0.00"},
    earnedMoney:{type:Number,required:false,default:0},
    description:{type:String,required:false,default:"description"},
    state: { type: String, required: false,default:"state"},
    status:{type:String,required:false,default:"inactive"},
    privacyPolicyAccepted: { type: Boolean, default: false, required: false },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    // assignedDrivertrack:{type:String,enum:["waytoPickup","arrivedtheStore","orderPicked","waytodeliver","arrivedAtLocation","orderDelivered"],default:null},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isLoggedIn:{type:Boolean,default:false},
    promotionImage:{type:Object,required:false},
    // boutiqueImage: { type: Object, required: false, default: { publicFileURL: "images/users/user.png", path: "public\\images\\users\\user.png" } },
    image: { type: Object, required: false, default: { publicFileUrl: "/images/users/user.png", path: "public\\images\\users\\user.png" } },
    role: { type: String, required: false, enum: ["admin", "shopper", "boutique", "driver"],default:"shopper"  },
    oneTimeCode: { type: String, required: false, default: null },
   
},{ timestamps: true },
 {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        },
    },
},
    
    
);


userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  };
  
  userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });


module.exports = mongoose.model('User', userSchema);