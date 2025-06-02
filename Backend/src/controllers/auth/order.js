const Order=require("../../models/ordersModel.js");

const placeOrder=async(res,res)=>{
    try {
        let {
            location,
            clientPhoneNo,
            fuelType,
            fuelVolume,
            amount,
            status
        }=req.body;

        const newOrder=new Order({
            location,
            clientPhoneNo,
            fuelType,
            fuelVolume,
            amount,
            status:'received'
        })

        const placedOrder=await newOrder.save();

        return res.status(200).json({
            message:"Order placed successfully!",
            order:placedOrder,
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

// get All orders

const getAllOrders=async(req,res)=>{
    try {
        const orders=await Order.find();
        return res.status(200).json({
            message:"Orders fetched successfully!",
            orders,
            success:true
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// get order by Id
const getOrderById=async(req,res)=>{
    try {
        const {id}=req.params;
        const order=await Order.findById(id);
        if(!order){
            return res.status(404).json({
                message:"Order not found",
                success:false
            })
        }
        return res.status(200).json({
            message:"Order fetched successfully!",
            order,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

module.exports={
    placeOrder,
    getAllOrders,
    getOrderById
}