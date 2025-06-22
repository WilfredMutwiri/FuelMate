const EmergencyRequestAssignmentSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmergencyFuelRequest"
},
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FuelStation" 
},
  status: {
    type: String,
    enum: ["assigned", "accepted", "rejected"],
    default: "assigned"
  },
  assignedByAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
},
  assignedAt: { type: Date, default: Date.now },
  respondedAt: { type: Date }
});

module.exports = mongoose.model("EmergencyRequestAssignment",EmergencyRequestAssignmentSchema);
