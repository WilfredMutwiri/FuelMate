const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require('../../models/auth/userSignupModel');
const Notification = require("../../models/notifications");

const userSignup=async(req,res)=>{
    try {
        let {email,username,password,phoneNo}=req.body;

        email=email.trim().toLowerCase();
        username=username.trim().toLowerCase();
        
        if(!(username && email && password)){
            return res.status(400).json({message: 'All fields are required'});
          }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return res.status(400).json({message: 'Invalid email'});
          }else if(!/^[a-zA-Z\s]*$/.test(username)){
            return res.status(400).json({message: 'Name must contain only letters'});
          }
        
        //   check if user exists
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            email,
            phoneNo,
            password:hashedPassword,
            username
        })

        const createdUser=await newUser.save();

        // notifications
        const newNotification = await Notification.create({
            user: createdUser._id,
            title: "Account Created Successfully",
            message:`Welcome aboard, ${username}! Your FuelMate account is all set up. Let’s get you fueled up anytime, anywhere.`
        });
        
        const io = req.app.get("io");

        io.emit("notification", {
            title: newNotification.title,
            message: newNotification.message
        });

        return res.status(200).json({
            message:"Account created successfully!",
            user:createdUser,
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


module.exports={
    userSignup
}