const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../../models/auth/userSignupModel");
const Admin=require('../../models/auth/adminModel');
const Notification = require("../../models/notifications");

const userSignin=async(req,res)=>{

    try {
        let {username,password}=req.body;

        username=username.trim().toLowerCase()

        if(!username ||!password){
            return res.status(400).json({message:"Username and Password are required!"})
        }
    
        const user=await User.findOne({username});
    
        if(!user){
            return res.status(400).json({message:"User does not exist!"})
        }
    
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"})
        }
    
        //token generation
        const token=jwt.sign({
            userId:user._id,
            username:user.username,
            email:user.email
        },
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
        );
    
        return res.status(200).cookie('access_token',token,{httpOnly:true}).json({
            message:"Login successfull!",
            success:true,
            token,
            user:{
                id:user._id,
                username:user.username,
                phoneNo:user.phoneNo,
                email:user.email
            }
        })
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
   
}

// get User Info
const getUserInfo=async(req,res)=>{
    const {userId}=req.params;
    try {
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({
            message:"User Info Fetched Successfully!",
            success:true,
            user
        })

    } catch (error) {
        return res.status(500).json({message:"Error fetching user info",error})
        
    }
}

const userSignout=(req,res)=>{
    try {
        res.clearCookie('access_token').status(200).json({
            message:"Signout successful!",
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// get Admin info
const getAdmins=async(req,res)=>{
    try {
        
        const admin = await Admin.findOne().sort({ _id: 1 })
        
        if(!admin){
            return res.status(404).json({
                message:"No admin found",
                success:false
            });
        }

        return res.status(200).json({
            message:"Admins Info Fetched Successfully!",
            success:true,
            adminsInfo:admin
        })

    } catch (error) {
        return res.status(500).json({
            message:"Error fetching admins",error,
            success:false
        })
        
    }
}

// get user notifications
const getUserNotifications=async(req,res)=>{
    let {userId}=req.params;
    
    try {
        const Notifications=await Notification.find({user:userId})
        .sort({createdAt:-1})

        res.json(Notifications);

    } catch (error) {
        return res.status(500).json({message:err.message})
    }
}

// mark notification as read
const markNotificationAsRead=async(req,res)=>{
    let {notificationId}=req.params;
    try {
        const notification=await Notification.findById(notificationId);
        if(!notification){
            return res.status(404).json({message:"Notification not found!"})
        }
        notification.read=true;
        await notification.save();
        return res.json(notification);
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


module.exports={
    userSignin,
    userSignout,
    getUserInfo,
    getAdmins,
    getUserNotifications,
    markNotificationAsRead
}