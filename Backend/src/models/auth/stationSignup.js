const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const stationSignupSchema=new Schema({
email:{
    type:String,
    required:true,
    unique:true
},
phoneNo:{
    type:Number,
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
},
fuel:{
    type:Array,
    required:true
},
services:{
    type:Array,
    required:false
},
rating:{
    type:Number,
    required:false
},
latitude:{
    type:Number,
    required:true
},
longitude:{
    type:Number,
    required:true
}
})

const Station=mongoose.model("Station ",stationSignupSchema);
module.exports=Station;