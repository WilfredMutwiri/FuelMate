require ("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const PORT=process.env.port||5000;
const router=require('./src/routes')
const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1',router);

//connect to db
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
}

connectDB();

//connection status
mongoose.connection.on("connected",()=>{
    console.log("Mongoose connected successfully");
});

mongoose.connection.on("error",(error)=>{
    console.log("Mongoose connection error",error.message);
});

mongoose.connection.on("disconnected",()=>{
    console.log("Mongoose disconnected from db");
});

//run server
const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

server.on("error",(err)=>{
    console.log("Server error",err.message)
})
