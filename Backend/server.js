require ("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const PORT=process.env.PORT || 5001;
const router=require('./src/routes')
const app=express();

const http = require("http");
const { Server } = require("socket.io");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1',router);

// socket
const socketServer = http.createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

// connect
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("hello", (data) => {
    console.log("Client says hello:", data);
  });

  socket.emit("notification", {
    title: "✨ Welcome Back to FuelMate",
    message: "Your Fuel, Delivered Anywhere,Anytime.",
  });

  socket.broadcast.emit("notification", {
    title: "New User",
    message: `A new user has joined (ID: ${socket.id})`,
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

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
const server=socketServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});



server.on("error",(err)=>{
    console.log("Server error",err.message)
})
