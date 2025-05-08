const User=require("../../models/auth/userSignupModel");
const bcrypt=require('bcrypt')


const resetPassword=async(req,res)=>{
    const {email,newPassword,otp}=req.body;
    try {
        const user=await User.findOne({email})
        if(!user) return res.status(404).json({message:"Invalid email"})
        
        if(user.resetOtp !=otp || Date.now() > user.otpExpires){
            return res.status(400).json({message:"Invalid or expired otp"})
        }

        user.password=await bcrypt.hash(newPassword,10)
        user.resetOtp=null;
        user.otpExpires=null;
        await user.save();

        res.status(200).json({message:"Passoword reset succesful!"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

module.exports={
    resetPassword
}