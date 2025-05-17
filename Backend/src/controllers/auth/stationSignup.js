const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Station=require("../../models/auth/stationSignup");

const stationSignup=async(req,res)=>{
    try {
        let {
            email,
            username,
            password,
            location,
            fuel,
            services,
            rating,
            phoneNo
        }=req.body;

        if(!(username && email && password && location && fuel && phoneNo)){
            return res.status(400).json({message: 'All fields are required'});
          }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return res.status(400).json({message: 'Invalid email'});
          }else if(!/^[a-zA-Z\s]*$/.test(username)){
            return res.status(400).json({message: 'Name must contain only letters'});
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

        const newStation=new Station({
            email,
            password:hashedPassword,
            username,
            location,
            fuel,
            services,
            rating,
            phoneNo
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


module.exports={
    stationSignup
}