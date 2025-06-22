const mongoose = require("mongoose");

const EmergencyFuelRequestSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true 
},
  clientPhone: {
    type: String,
    required: true 
},
  fuelType: {
    type: String,
    required: true,
    enum:['petrol','diesel','gasoline','kerosene']
},
  fuelVolume: {
    type: Number,
    required: true
},
  urgency: {
    type: String,
    enum: ["immediate", "1_hour", "2_hours"],
    required: true
  },
  message: {
    type: String
},
clientLocation:{
  type:{
    type:String,
    enum:['Point'],
    default:'Point'
  },
  coordinates:{
    type:[Number],
    required:true
  }
}
,
  status: {
    type: String,
    enum: ["pending", "assigned", "accepted", "rejected", "delivered", "cancelled"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

EmergencyFuelRequestSchema.index({ clientLocation: "2dsphere" }); // for geolocation

module.exports = mongoose.model("EmergencyFuelRequest", EmergencyFuelRequestSchema);
