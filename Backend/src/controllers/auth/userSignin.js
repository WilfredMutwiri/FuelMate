const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../../models/auth/userSignupModel");

const userSignin=async(req,res)=>{

    try {

        let {username,password}=req.body;

        username=username.trim();
        password=password.trim();
    
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
            email:user.username
        },
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
        );
    
        return res.status(200).json({
            message:"Login successfull!",
            token,
            user:{
                id:user._id,
                email:user.username
            }
        })
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
   
}

module.exports={
    userSignin
}