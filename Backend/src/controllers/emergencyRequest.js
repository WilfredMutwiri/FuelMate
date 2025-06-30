const Station = require("../models/auth/stationSignup");
const EmergencyOrder = require("../models/emergencyOrder");
const { generateOrderReceiptPdf } = require('./generateOrderReceipt');
const Order=require("../models/ordersModel.js");
const Notification = require("../models/notifications");

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

    // notifications
    const newNotification = await Notification.create({
        user:userId,
        title: "New Emergency Order Placed Successfully",
        message: `Hi, we’ve received your emergency order request and our team is already on it! Sit tight—fuel is on the way. Sorry for the emergency.`
    });
                
    const io = req.app.get("io");
        
    io.to(userId.toString()).emit("notification", {
      title: newNotification.title,
      message: newNotification.message
    });

    const stationNotification = await Notification.create({
      user:nearbyStations[0]._id,
      title: "New Emergency Order Received",
      message: `A new emergency fuel delivery has just been assigned to you! Please review and accept the order right away to ensure the fastest possible service. If you can’t complete this urgent request, kindly decline so another station can step in immediately.`
    });
    
            
    io.to(nearbyStations[0]._id.toString()).emit("notification", {
      title: stationNotification.title,
      message: stationNotification.message
    });
        
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


    // Notification messages
  const statusMessages = {
    pending: {
      title: "Order Pending",
      message: "Your emergency fuel request has been received and is awaiting assignment."
    },
    assigned: {
      title: "Order Assigned",
      message: "A nearby fuel station has been assigned to your order."
    },
    accepted: {
      title: "Order Accepted",
      message: "The assigned station has accepted your request and is preparing your fuel delivery."
    },
    rejected: {
      title: "Order Rejected",
      message: "Unfortunately, the assigned station was unable to accept your order. We'll look for another station soon."
    },
    reassigned: {
      title: "Order Reassigned",
      message: "Your order has been reassigned to another station to ensure timely delivery."
    },
    delivered: {
      title: "Order Delivered",
      message: "Your emergency fuel delivery has arrived. Thank you for using FuelMate!"
    },
    cancelled: {
      title: "Order Cancelled",
      message: "Your emergency order has been cancelled. If you need assistance, please contact support."
    }
  };

  const notification = await Notification.create({
   user: updatedOrder.user, 
   title: statusMessages[newStatus].title,
   message: statusMessages[newStatus].message
 });

// Send notification to the user
const io = req.app.get("io");
io.to(updatedOrder.user.toString()).emit("notification", {
  title: notification.title,
  message: notification.message
});
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
      createdAt: new Date(),
    });
    
    order.assignmentHistory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

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


// generate order receipt
const generateReceipt=async(req,res)=>{
  try {
    const {orderId}=req.params
    let order = await Order.findById(orderId)
      .populate('customer')
      .populate('station');

      if (!order){
        order = await EmergencyOrder.findById(orderId)
        .populate('user')
        .populate('assignedStation');
      };

      if(!order){
        return res.status(404).json({
         message: 'Order not found',
         success:false
        });
      }

      const pdfBuffer = await generateOrderReceiptPdf(
        order, 
        order.customer || order.user,
        order.station || order.assignedStation
      );
      
      res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=order_${order._id}_receipt.pdf`,
      });

      res.send(pdfBuffer);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to generate receipt' });
    }
}

module.exports={
  createEmergencyOrder,
  getAllEmergencyRequests,
  getEmergencyOrder,
  updateEmergencyOrderStatus,
  reassignEmergencyOrder,
  getEmergencyOrdersByStatus,
  getEmergencyOrdersForStation,
  getEmergencyOrdersForUser,
  generateReceipt
}