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

// get orders by customer
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


// delivered orders by station
const getDeliveredOrdersByStation=async(req,res)=>{
    const stationId=req.params.id;

    try {
        const deliveredOrders=await Order.find({
            station:stationId,
            status:"delivered",
        }).populate("station").sort({createdAt:-1})

        return res.status(200).json({
            message:"Delivered orders for station fetched successfully!",
            deliveredOrders,
            totalOrders:deliveredOrders.length,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}


// canceled orders by station
const getCanceledOrdersByStation=async(req,res)=>{
    const stationId=req.params.id;

    try {
        const canceledOrders=await Order.find({
            station:stationId,
            status:"canceled",
        }).populate("station").sort({createdAt:-1})

        return res.status(200).json({
            message:"Canceled orders for station fetched successfully!",
            canceledOrders,
            totalOrders:canceledOrders.length,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}



// approved orders by station
const getApprovedOrdersByStation=async(req,res)=>{
    const stationId=req.params.id;

    try {
        const approvedOrders=await Order.find({
            station:stationId,
            status:"approved",
        }).populate("station").sort({createdAt:-1})

        return res.status(200).json({
            message:"approved orders for station fetched successfully!",
            approvedOrders,
            totalOrders:approvedOrders.length,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

// get total amount raised from orders
const getTotalAmountByStation=async(req,res)=>{
    const stationId=req.params.id;

    try {
        const orders=await Order.find({station:stationId});

        const totalAmount=orders.reduce((sum,order)=>sum+order.amount,0);

        return res.status(200).json({
            message:"Total amount for this station calculated successfully!",
            totalAmount,
            success:true
        });
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

// get total fuel volume ordered per station
const getTotalVolumeDeliveredByStation=async(req,res)=>{
    const stationId=req.params.id;

    try {
        const deliveredOrders=await Order.find({
            station:stationId,
            status:"delivered"
        });

        const totalVolume=deliveredOrders.reduce((sum,order)=>sum+order.fuelVolume,0);

        return res.status(200).json({
            message:"Total fuel volume delivered by this station calculated successfully!",
            totalVolume,
            success:true
        })
        
    } catch (error) {
        return  res.status(500).json({message:error.message,success:false})
    }
}

// get orders by month
const getOrdersByMonth=async(req,res)=>{
    const {stationId, month, year} = req.params;

    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    if (monthInt < 1 || monthInt > 12 || yearInt < 2000) {
    return res.status(400).json({
        message: "Invalid month or year",
        success: false
    });
    }

    try {
        const orders = await Order.find({
            station: stationId,
            createdAt: {
                $gte: new Date(yearInt, monthInt - 1, 1),
                $lt: new Date(yearInt, monthInt, 1)
            }
        })
        .populate('station');


        return res.status(200).json({
            message: "Orders for the specified month fetched successfully!",
            orders,
            totalOrders: orders.length,
            success: true
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

module.exports={
    placeOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    getOrdersByStation,
    getOrdersByCustomer,
    getDeliveredOrdersByStation,
    getCanceledOrdersByStation,
    getApprovedOrdersByStation,
    getTotalAmountByStation,
    getTotalVolumeDeliveredByStation,
    getOrdersByMonth
}