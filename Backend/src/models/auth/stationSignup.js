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
            required:false,
            enum: ['petrol', 'diesel', 'kerosene', 'lpg', 'cng', 'electric', 'biodiesel', 'ethanol'],
            set: v => v.trim().toLowerCase()
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
RegNo:{
    type:String,
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
isAvailableForEmergency: {
    type: Boolean,
    default: true
},
location: {
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point' 
    },

    coordinates: {
        type: [Number],
        required: true 
    }
},
createdAt:{
    type:Date,
    default:Date.now
},
})

stationSignupSchema.index({location:"2dsphere"})
const Station=mongoose.model("Station",stationSignupSchema);
module.exports=Station;