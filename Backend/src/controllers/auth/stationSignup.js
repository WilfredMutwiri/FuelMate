const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Station=require("../../models/auth/stationSignup");

const stationSignup=async(req,res)=>{
    try {
        let {
            email,
            username,
            password,
            town,
            fuel,
            services,
            rating,
            // latitude,   
            // longitude,
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
            rating,
            // latitude,
            // longitude,
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

        return res.status(200).json({
            message:"Station created successfully!",
            user:createdStation,
            success:true
        })
    } catch (error) {
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
            message:"Order not found"
            })
        }
    
        return res.status(200).json({
            message:"Order updated successfully",
            station:updatedStation,
            success:true
        })
    
        } catch (error) {
            return res.status(500).json({
                message:error.message
            })
        }
    

}
module.exports={
    stationSignup,
    getAllStations,
    getStationById,
    updateStation,
    deleteStation,
    updateStationStatus
}