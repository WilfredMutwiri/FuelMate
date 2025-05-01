const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const stationSignupSchema=new Schema({
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
location:{
    type:String,
    required:true
}
})

const Station=mongoose.model("Station ",stationSignupSchema);
module.exports=Station;