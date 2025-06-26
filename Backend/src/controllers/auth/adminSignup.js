const bcrypt=require("bcrypt");
const Admin=require('../../models/auth/adminModel');

const adminSignup=async(req,res)=>{
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
        const adminExists=await Admin.findOne({email});
        if(adminExists){
            return res.status(400).json({message:"Admin already exists"});
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        const newAdmin=new Admin({
            email,
            password:hashedPassword,
            username,
            phoneNo,
            role:"admin"
        })

        const createdAdmin=await newAdmin.save();

        return res.status(200).json({
            message:"Admin account created successfully!",
            user:createdAdmin,
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


module.exports={
    adminSignup
}