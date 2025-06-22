const EmergencyOrder=require('../models/emergencyOrder');

const createEmergencyOrder=async(req,res)=>{
    try {
        let {
            clientName,
            clientPhone,
            fuelType,
            fuelVolume,
            urgency,
            message,
            status,
            clientLocation
        }=req.body;

        clientName=clientName.trim().toLowerCase();
        fuelType=fuelType.trim().toLowerCase();
        urgency=urgency.trim().toLowerCase();

        const newEmergencyOrder=new EmergencyOrder({
            clientName,
            clientPhone,
            fuelType,
            fuelVolume,
            urgency,
            message,
            clientLocation,
            status:'pending'
        })

        const placedEmergencyOrder=await newEmergencyOrder.save();

        return res.status(200).json({
            message:"Emergency order placed successfully",
            success:true,
            order:placedEmergencyOrder
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error: error.message
        })
        
    }
}

module.exports ={
createEmergencyOrder
}