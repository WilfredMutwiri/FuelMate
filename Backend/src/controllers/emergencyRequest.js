const Station = require("../models/auth/stationSignup");
const EmergencyOrder = require("../models/emergencyOrder");

const createEmergencyOrder = async (req, res) => {
  try {
    let {
      clientName,
      clientPhone,
      fuelType,
      fuelVolume,
      urgency,
      message,
      clientLocation
    } = req.body;

    // Normalize inputs
    clientName = clientName.trim().toLowerCase();
    fuelType = fuelType.trim().toLowerCase();
    urgency = urgency.trim().toLowerCase();

    // Create the order
    const newOrder = new EmergencyOrder({
      clientName,
      clientPhone,
      fuelType,
      fuelVolume,
      urgency,
      message,
      clientLocation,
      status: "pending"
    });

    const placedOrder = await newOrder.save();

    console.log("Client coordinates:", clientLocation.coordinates);

    // Find nearby stations (within 10km)
    const nearbyStations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: clientLocation.coordinates
          },
          $maxDistance: 10000
        }
      },
      status: "Approved",
      isAvailableForEmergency: true
    }).limit(10);

    console.log("Nearby stations found:", nearbyStations.length);

    if (nearbyStations.length > 0) {
      placedOrder.assignedStation = nearbyStations[0]._id;

      // Save nearby station IDs for admin visibility
      placedOrder.nearbyStations = nearbyStations.map(station => station._id);

      // Add to assignmentHistory
      placedOrder.assignmentHistory.push({
        station: nearbyStations[0]._id,
        status: "assigned"
      });

      await placedOrder.save();
    }

    return res.status(200).json({
      message: "Emergency order placed successfully",
      success: true,
      order: placedOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports={
    createEmergencyOrder
}