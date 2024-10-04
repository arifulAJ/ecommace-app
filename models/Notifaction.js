const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    isParoved:{  type: String,
      enum: ["pending", "aproved", "denay"],default:"pending"  },
    title:{
      type: String,
      required: false,
    },
    message: { type: String, required: false },
    image: { type: Object, required: false },
    linkId: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "shopper", "boutique", "driver"],default:"shopper"  
    },
    type: {
      type: String,
      enum: ["signup", "payment", "unknown","product","chagepassword","order","withdrow","delivered","admin","product-denay","driver"],
      default: "unknown",
    },
    viewStatus: { type: Boolean, enum: [true, false], default: false },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// notificationSchema.plugin(toJSON);


module.exports = mongoose.model("Notification", notificationSchema);