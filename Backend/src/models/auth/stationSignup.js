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
town:{
    type:String,
    required:true
},
fuel:[
    {
        type:{
            type:String,
            required:true,
            enum:['petrol', 'diesel', 'gasoline', 'kerosene']
        },
        price:{
            type:Number,
            default:0
        }
    }
],
services:{
    type:Array,
    required:true
},
rating:{
    type:Number,
    required:false
},
// latitude:{
//     type:Number,
//     required:false
// },
// longitude:{
//     type:Number,
//     required:false
// },
RegNo:{
    type:Number,
    required:true
},
physicalAddress:{
    type:String,
    required:true
},
county:{
    type:String,
    required:true
},
profileImg:{
    type:String,
    required:true
},
stationName:{
    type:String,
    require:true
},
BusinessCert:{
    type:String,
    required:true
},
status:{
    type:String,
    enum:['Not Approved','Approved'],
    default:'Not Approved'
},
createdAt:{
    type:Date,
    default:Date.now
},
})

const Station=mongoose.model("Station ",stationSignupSchema);
module.exports=Station;