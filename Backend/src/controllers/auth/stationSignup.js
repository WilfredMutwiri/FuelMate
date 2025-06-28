const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Station=require("../../models/auth/stationSignup");
const Order=require("../../models/ordersModel");
const EmergencyOrder = require("../../models/emergencyOrder");
const Notification = require("../../models/notifications");

const stationSignup=async(req,res)=>{
    try {
        let {
            email,
            username,
            password,
            town,
            fuel,
            services,
            location, 
            RegNo,
            physicalAddress,
            county,
            postalCode,
            phoneNo,
            profileImg,
            stationName,
            BusinessCert,
            status
        }=req.body;
        
        username=username.trim().toLowerCase();

        if(!(username && email && password && phoneNo)){
            return res.status(400).json({message: 'All fields are required'});
          }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return res.status(400).json({message: 'Invalid email'});
          }else if(phoneNo.toString().length>14 || phoneNo.toString().length<10){
            return res.status(400).json({message:"Invalid phone number"})
          }
        
        //   check if station exists
        const stationExists=await Station.findOne({email});
        if(stationExists){
            return res.status(400).json({message:"Station already exists"});
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);
        
        const fuelData=fuel.map(fuelType=>({
            type:fuelType.type,
            price:fuelType.price
        }))

        const newStation=new Station({
            email,
            password:hashedPassword,
            username,
            town,
            fuel:fuelData,
            services,
            location,
            RegNo,
            physicalAddress,
            county,
            postalCode,
            phoneNo,
            profileImg,
            stationName,
            BusinessCert,
            status:'Not Approved'
        })

        const createdStation=await newStation.save();

        // send notification
        const newNotification = await Notification.create({
            user:createdStation._id,
            title: "Account Created Successfully",
            message: `Welcome to FuelMate! Your station account has been created successfully. To start receiving orders, please update your fuel prices and ensure you’ve uploaded a valid registration certificate. Once verified, your station will be approved and ready to serve customers.`
        });
                        
        const io = req.app.get("io");
                
        io.to(createdStation._id.toString()).emit("notification", {
            title: newNotification.title,
            message: newNotification.message
        });

        return res.status(200).json({
            message:"Station created successfully!",
            user:createdStation,
            success:true
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:error.message})
    }
}


// get all stations
const getAllStations=async(req,res)=>{
    try {
        const stations=await Station.find().sort({createdAt:-1});
        return res.status(200).json({
            message:"Stations fetched successfully",
            stations,
            totalStations:stations.length,
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// get all approved stations
const getAllApprovedStations=async(req,res)=>{
    try {
        const stations=await Station.find({status:'Approved'}).sort({createdAt:-1});
        return res.status(200).json({
            message:"Stations fetched successfully",
            stations,
            totalStations:stations.length,
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// get all stations with Not Approved status
const getAllNotApprovedStations=async(req,res)=>{
    try {
        const stations=await Station.find({status:'Not Approved'}).sort({createdAt:-1});
        return res.status(200).json({
            message:"Stations fetched successfully",
            stations,
            totalStations:stations.length,
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// get station by id
const getStationById=async(req,res)=>{
    try {
        const {id}=req.params;
        const station=await Station.findById(id);
        if(!station){
            return res.status(404).json({message:"Station not found"});
        }
        return res.status(200).json({
            message:"Station fetched successfully",
            station
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


// update station
const updateStation=async(req,res)=>{
    try {
        const {id}=req.params;
        const station=await Station.findById(id);
        if(!station){
            return res.status(404).json({message:"Station not found"});
        }
        const updatedStation=await Station.findByIdAndUpdate(id,req.body,{new:true});
        return res.status(200).json({
            message:"Station updated successfully",
            station:updatedStation
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// delete station
const deleteStation=async(req,res)=>{
    try {
        const {id}=req.params;
        const station=await Station.findById(id);
        if(!station){
            return res.status(404).json({message:"Station not found"});
        }
        await Order.deleteMany({ station: id });
        await EmergencyOrder.deleteMany({assignedStation:id});
        await Station.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Station deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// update station status
const updateStationStatus=async(req,res)=>{
    let {id} = req.params;
    let {newStatus}=req.body;

    const validStatus=['Not Approved','Approved'];
    if(!validStatus.includes(newStatus)){
        return res.status(400).json({
            message:"Invalid station status",
            sucess:false
        })
    }

    try {
        const updatedStation=await Station.findByIdAndUpdate(
            id,
            {status:newStatus},
            {new:true}
        );
    
        if(!updatedStation){
            return res.status(404).json({
            message:"Station not found"
            })
        }

        // send notification
        // Determine the notification message based on status
        let notificationTitle = "";
        let notificationMessage = "";

        if (newStatus === "Approved") {
        notificationTitle = "Station Approved 🎉";
        notificationMessage = `Congratulations! Your station has been approved and is now ready to start receiving orders. Welcome to the FuelMate network!`;
        } else {
        notificationTitle = "Station Not Approved";
        notificationMessage = `Unfortunately, your station has been disapproved due to policy violations. Please contact support at 0745567568 to resolve the issue and reactivate your account.`;
        }

        // Create notification
        const newNotification = await Notification.create({
        user: id,
        title: notificationTitle,
        message: notificationMessage
        });

        // Emit notification
        const io = req.app.get("io");
        io.to(id.toString()).emit("notification", {
        title: newNotification.title,
        message: newNotification.message
        });
        
        return res.status(200).json({
            message:"Station updated successfully",
            station:updatedStation,
            success:true
        })
    
        } catch (error) {
            return res.status(500).json({
                message:error.message
            })
        }
}

// get nearby stations
const getNearbyStations = async (req, res) => {
  const { longitude, latitude } = req.query;

  if (!longitude || !latitude) {
    return res.status(400).json({ message: "Coordinates required" });
  }

  try {
    const stations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 10km
        },
      },
        status: "Approved",
    });

    return res.status(200).json({ 
        success: true,
        stations
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message 
    });
  }
};

// update/add an new fuel type  and price
const updateStationFuel = async (req, res) => {
    const { id } = req.params;
    const { fuel } = req.body;

    if (!fuel || !Array.isArray(fuel)) {
        return res.status(400).json({ message: "Fuel data must be an array." });
    }

    try {
        const station = await Station.findById(id);
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        // Overwrite the entire fuel array with what's sent from frontend

        station.fuel = fuel;
        await station.save();

        return res.status(200).json({
            message: "Fuel types updated successfully",
            fuel: station.fuel,
            success: true
        });
    } catch (error) {
        console.error("Fuel update error:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

// update station services
const addStationService = async (req, res) => {
    const { id } = req.params;
    const { services } = req.body;

    if (!Array.isArray(services)) {
        return res.status(400).json({ message: "Services must be an array." });
    }

    try {
        const station = await Station.findById(id);
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        const currentServices = station.services || [];

        // Merge and deduplicate
        const updatedServices = Array.from(new Set([...currentServices, ...services.map(s => s.trim().toLowerCase())]));

        station.services = updatedServices;
        await station.save();

        res.status(200).json({
            message: "Services updated successfully",
            services: station.services,
            success: true
        });
    } catch (error) {
        console.error("Add service error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// delete station service
const deleteStationService = async (req, res) => {
    const { id } = req.params;
    const { services } = req.body;

    if (!Array.isArray(services)) {
        return res.status(400).json({ message: "Services must be an array." });
    }

    try {
        const station = await Station.findById(id);
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        const updatedServices = station.services.filter(
            s => !services.map(item => item.trim().toLowerCase()).includes(s.toLowerCase())
        );

        station.services = updatedServices;
        await station.save();

        res.status(200).json({
            message: "Service(s) deleted successfully",
            services: station.services,
            success: true
        });
    } catch (error) {
        console.error("Delete service error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// feedback -like, dislikes, stars for a station
// function to automatically calculate stars based on likes
function calculateStarsFromLikes(likesCount) {
    if (likesCount >= 400) return 5;
    if (likesCount >= 300) return 4;
    if (likesCount >= 200) return 3;
    if (likesCount >= 100) return 2;
    return 1;
}

// get the statisticts
const getStationStats = async (req, res) => {
    const { id } = req.params;

    try {
        const station = await Station.findById(id);
        if (!station) return res.status(404).json({ message: "Station not found" });

        return res.status(200).json({
            likes: station.likedBy.length,
            dislikes: station.dislikedBy.length,
            starsRating: station.starsRating,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// like station
const likeStation = async (req, res) => {
    const { stationId, userId } = req.params;

    try {
        const station = await Station.findById(stationId);
        if (!station) return res.status(404).json({
            message: "Station not found",
            success:false
        });

        if (station.likedBy.includes(userId)) {
            return res.status(400).json({ 
                message: "You already liked this station",
                success:false
            });
        }

        // Remove from dislikes
        station.dislikedBy = station.dislikedBy.filter(id => id.toString() !== userId);

        // Add to likes
        station.likedBy.push(userId);

        // Calculate new stars rating based on likes
        const newLikesCount = station.likedBy.length;
        station.starsRating = calculateStarsFromLikes(newLikesCount);

        await station.save();

        return res.status(200).json({
            message: "Station liked successfully",
            likes: newLikesCount,
            starsRating: station.starsRating,
            success:true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success:false
        });
    }
};


// dislike a station
const dislikeStation = async (req, res) => {
    const { stationId, userId } = req.params;

    try {
        const station = await Station.findById(stationId);
        if (!station) return res.status(404).json({
            message: "Station not found",
            success:false
        });

        if (station.dislikedBy.includes(userId)) {
            return res.status(400).json({
                message: "You already disliked this station",
                success:false
            });
        }

        // Remove from likes
        station.likedBy = station.likedBy.filter(id => id.toString() !== userId);

        // Add to dislikes
        station.dislikedBy.push(userId);

        // Recalculate stars rating based on reduced likes
        const newLikesCount = station.likedBy.length;
        station.starsRating = calculateStarsFromLikes(newLikesCount);

        await station.save();

        return res.status(200).json({
            message: "Station disliked!",
            dislikes: station.dislikedBy.length,
            starsRating: station.starsRating,
            success:true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success:true
        });
    }
};


// toggle between opening and closing a station
const toggleStationOpenStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const station = await Station.findById(id);
    if (!station) {
      return res.status(404).json({
        message: "Station not found",
        success: false,
    });
    }

    // Toggle the isOpen status
    station.isOpen = !station.isOpen;
    await station.save();

    return res.status(200).json({
      message: `Station is now ${station.isOpen ? "Open" : "Closed"}`,
      isOpen: station.isOpen,
      success: true,
    });
  } catch (error) {
    console.error("Error toggling station open status:", error.message);
    return res.status(500).json({ 
        message: "Server error",
        success: false 
    });
  }
};


module.exports={
    stationSignup,
    getAllStations,
    getStationById,
    updateStation,
    deleteStation,
    updateStationStatus,
    getAllApprovedStations,
    getAllNotApprovedStations,
    getNearbyStations,
    updateStationFuel,
    addStationService,
    deleteStationService,
    getStationStats,
    likeStation,
    dislikeStation,
    toggleStationOpenStatus
}