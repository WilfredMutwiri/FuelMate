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
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
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
readableLocation:{
  type:String,
  required:true
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
},
nearbyStations: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station"
  }
],
status: {
    type: String,
    enum: ["pending", "assigned", "accepted", "rejected", "delivered"],
    default: "pending"
  },
  assignedStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station"
  },
  assignmentHistory: [
    {
      station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station"
      },
      status: {
        type: String,
        enum: ["assigned","reassigned"],
        default: "assigned"
      },
      assignedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

EmergencyFuelRequestSchema.index({ clientLocation: "2dsphere" }); // for geolocation

module.exports = mongoose.model("EmergencyFuelRequest", EmergencyFuelRequestSchema);
