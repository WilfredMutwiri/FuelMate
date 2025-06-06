const Order=require("../../models/ordersModel.js");

const placeOrder=async(req,res)=>{
    try {
        let {stationId}=req.params;
        let {
            location,
            clientPhoneNo,
            fuelType,
            fuelVolume,
            amount,
            status,
            customer,
        }=req.body;

        fuelType=fuelType.trim().toLowerCase();

        const newOrder=new Order({
            location,
            clientPhoneNo,
            fuelType,
            fuelVolume,
            amount,
            customer,
            status:'received',
            station:stationId
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
        // let {stationId}=req.params;
        const orders=await Order.find();
        // const orders=await Order.find();
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

// update order status
const updateOrder=async(req,res)=>{
    let {id}=req.params;
    let {newStatus}=req.body;
    const validStatus=['received','approved','delivered','canceled'];
    if(!validStatus.includes(newStatus)){
        return res.status(400).json({
            message:"Invalid order status",
            sucess:false
        })
    }

    try {
        const updatedOrder=await Order.findByIdAndUpdate(
            id,
            {status:newStatus},
            {new:true}
        );

        if(!updatedOrder){
            return res.status(404).json({
                message:"Order not found"
            })
        }

        return res.status(200).json({
            message:"Order updated successfully",
            order:updatedOrder,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }

}

// get orders by station
const getOrdersByStation=async(req,res)=>{
    let stationId=req.params.id;
    try {
        const orders=await Order.find({station:stationId}).populate('station').sort({createdAt:-1});
        return res.status(200).json({
            message:'Station orders fetched successfully!',
            stationOrders:orders,
            totalOrders:orders.length,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })        
    }
}

// get orders by cstomer
const getOrdersByCustomer=async(req,res)=>{
    let customer=req.params.id;
    try {
        const orders=await Order.find({customer:customer}).populate('customer').sort({createdAt:-1});
        return res.status(200).json({
            message:'Customer orders fetched successfully!',
            customerOrders:orders,
            totalOrders:orders.length,
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
    getOrderById,
    updateOrder,
    getOrdersByStation,
    getOrdersByCustomer
}