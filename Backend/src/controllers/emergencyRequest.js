const Station = require("../models/auth/stationSignup");
const EmergencyOrder = require("../models/emergencyOrder");

const createEmergencyOrder = async (req, res) => {
  const {userId}=req.params;

  try {
    let {
      clientName,
      clientPhone,
      fuelType,
      fuelVolume,
      urgency,
      message,
      readableLocation,
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
      readableLocation,
      status: "pending",
      user: userId,
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


// get all emergency requests
const getAllEmergencyRequests=async(req,res)=>{

  try {
    const orders=await EmergencyOrder.find()
    .populate('assignedStation nearbyStations assignmentHistory.station')
    .sort({createdAt:-1})

    return res.status(200).json({
      success:true,
      totalOrders:orders.length,
      orders
    })
  } catch (error) {
    return res.statu(500).json({
      success:false,
      message:"Failed to fetch emergency requests!",
      error:error.message
    })
  }
}

// get A single emergency order
const getEmergencyOrder=async(req,res)=>{
  const {orderId}=req.params;

  try {
    const order=await EmergencyOrder.findById(orderId)
    .populate('assignedStation nearbyStations assignmentHistory.station');

    return res.status(200).json({
      message:"Emergency order fetched successfully!",
      success:true,
      order
    })

  } catch (error) {
    return res.status(500).json({
      message:"Failed to get emergency order!",
      success:false,
      error:error.message
    })
  }
}


// update emergency order status
const updateEmergencyOrderStatus=async(req,res)=>{
  const {orderId}=req.params;
  let {newStatus}=req.body;
  const validStatus=["pending", "assigned", "accepted", "rejected", "delivered", "cancelled","reassigned"];
  if(!validStatus.includes(newStatus)){
    return res.status(400).json({
        message:"Invalid order status",
        sucess:false
    })
  }

  try {
    
    const updatedOrder=await EmergencyOrder.findByIdAndUpdate(
      orderId,
      {status:newStatus},
      {new:true}
    );
    
    if(!updatedOrder){
      return res.status(404).json({
      message:"Order not found"
    })}

    return res.status(200).json({
      message:"Order updated successfully",
      order:updatedOrder,
      success:true
    })

  } catch (error) {
    
  return res.status(500).json({
      message:"Failed to update emergency order",
      success:false,
      error:error.message
  })}
}

// reassign emergency order
const reassignEmergencyOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await EmergencyOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    // Ensure the order has a valid location
    const clientLocation = order.clientLocation;
    if (
      !clientLocation ||
      !clientLocation.coordinates ||
      clientLocation.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message: "Invalid or missing client location",
        success: false,
      });
    }

    // Exclude the currently assigned station
    const excludedStationId = order.assignedStation?.toString();

    const nearbyStations = await Station.find({
      _id: { $ne: excludedStationId }, // Exclude current station
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: clientLocation.coordinates,
          },
          $maxDistance: 10000,
        },
      },
      status: "Approved",
      isAvailableForEmergency: true,
    }).limit(5);

    if (nearbyStations.length === 0) {
      return res.status(404).json({
        message: "No alternative station found nearby",
        success: false,
      });
    }

    const newStation = nearbyStations[0];

    // Reassign
    order.assignedStation = newStation._id;
    order.status = "assigned";
    order.assignmentHistory.push({
      station: newStation._id,
      status: "reassigned",
    }).sort('createdAt');

    await order.save();

    return res.status(200).json({
      message: "Order reassigned to a new station",
      success: true,
      newStation,
      order,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to reassign order",
      success: false,
      error: error.message,
    });
  }
};

// get emergency order by status
const getEmergencyOrdersByStatus=async(req,res)=>{
    const status=req.params.status;

    try {
        const Orders=await EmergencyOrder.find({
          status:status
        }).sort({createdAt:-1})

        return res.status(200).json({
            message:"Emergency orders fetched successfully!",
            Orders,
            totalOrders:Orders.length,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

// Get emergency orders assigned to a specific station
const getEmergencyOrdersForStation = async (req, res) => {
  const { stationId } = req.params;

  try {
    const orders = await EmergencyOrder.find({ assignedStation: stationId })
      .sort({ createdAt: -1 })
      .populate('assignedStation');

    res.status(200).json({
      message: 'Emergency Orders for this station fetched successfully!',
      orders,
      total: orders.length,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch orders for the station.',
      error: error.message,
      success: false
    });
  }
};

// get user emergency orders
const getEmergencyOrdersForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await EmergencyOrder.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('assignedStation nearbyStations assignmentHistory.station');

    return res.status(200).json({
      message: "Emergency orders for the user fetched successfully!",
      orders,
      totalOrders: orders.length,
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch emergency orders for user",
      success: false,
      error: error.message
    });
  }
};

module.exports={
  createEmergencyOrder,
  getAllEmergencyRequests,
  getEmergencyOrder,
  updateEmergencyOrderStatus,
  reassignEmergencyOrder,
  getEmergencyOrdersByStatus,
  getEmergencyOrdersForStation,
  getEmergencyOrdersForUser
}