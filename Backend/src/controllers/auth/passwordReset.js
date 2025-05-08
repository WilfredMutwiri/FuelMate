const User=require("../../models/auth/userSignupModel");
const crypto = require('crypto');
const nodemailer=require('nodemailer');

const requestPasswordReset=async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user) return res.status(404).json({message:"Invalid Email"});

        const otp=Math.floor(100000 + Math.random()*900000)
        const otpExpiry=Date.now()+10*60*1000;

        user.resetOtp=otp;
        user.otpExpires=otpExpiry;
        await user.save();


        // sending otp
        const transporter=nodemailer.createTransport({
            service:'Gmail',
            auth:{
                user:process.env.Email_user,
                pass:process.env.Email_Pass
            }
        })

        await transporter.sendMail({
            from:process.env.Email_User,
            to:email,
            subject:"Password reset OTP",
            html:`<h2>Your OTP is ${otp} </h2>
            <p>
            Hello! We have received a request to change your FuelMate account password.Your OTP expires in 10 minutes. If this was not you, Kindly ignore this email.All the best in your fuel search!
            </p>`
        })

        res.status(200).json({message:"OTP sent successfully!"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports={
    requestPasswordReset
}