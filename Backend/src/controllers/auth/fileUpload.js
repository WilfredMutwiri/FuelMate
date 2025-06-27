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

// certificate upload
const certificateUpload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Certificates',
      resource_type: 'auto',  // Let it detect
      eager: [
        { format: 'png' }  // Force transform to PNG in eager
      ]
    });

    fs.unlinkSync(req.file.path);

    // The eager[0].secure_url is always the PNG
    const transformedUrl = result.eager[0].secure_url;

    console.log("Upload complete, sending response:", transformedUrl);

    return res.status(200).json({
      success: true,
      message: "Certificate uploaded successfully",
      fileUrl: transformedUrl
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Certificate upload failed",
      error: error.message,
      success: false
    });
  }
};


module.exports = {
    fileUpload,
    certificateUpload
};