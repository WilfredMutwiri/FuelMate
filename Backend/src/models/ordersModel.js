const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim: true,
  },
  clientPhoneNo: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ["petrol", "diesel", "gasoline", "kerosene"],
  },
  fuelVolume: {
    type: Number,
    required: true,
    min: 1,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["received", "approved", "delivered", "canceled"],
    default: "received",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
