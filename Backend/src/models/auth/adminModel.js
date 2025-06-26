const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const AdminSignupSchema=new Schema({
email:{
    type:String,
    required:true,
    unique:true
},
username:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
phoneNo:{
    type:Number,
    required:true
},
role:{
    type:String,
    default:"admin",
    required:false,
    immutable:true
}
})

const Admin=mongoose.model("Admin",AdminSignupSchema);
module.exports=Admin;