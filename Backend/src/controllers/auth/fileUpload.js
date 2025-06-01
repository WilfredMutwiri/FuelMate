const cloudinary =require('./cloudinary.js');
const fs = require('fs');

const fileUpload=async(req,res)=>{
    try {
        const result=await cloudinary.uploader.upload(req.file.path,{
            folder:'stations',
        });

        fs.unlinkSync(req.file.path);

        console.log("Upload complete, sending response:", result.secure_url);
        return res.status(200).json({
            success:true,
            message:"File uploaded successfully",
            fileUrl:result.secure_url
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:'File upload failed',
            error:error.message,
            success:false
        });
    }
}


// certificaet upload
const certUpload=async(req,res)=>{
    try {
        const result=await cloudinary.uploader.upload(req.file.path,{
            folder:'Certificates',
        });

        fs.unlinkSync(req.file.path);

        console.log("Upload complete, sending response:", result.secure_url);
        return res.status(200).json({
            success:true,
            message:"Certificate uploaded successfully",
            fileUrl:result.secure_url
        });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:'Certificate upload failed',
            error:error.message,
            success:false
        });
    }
}

module.exports = {
    fileUpload,
    certUpload
};