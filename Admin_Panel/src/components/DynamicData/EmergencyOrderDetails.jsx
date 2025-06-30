import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import {SERVER_URL} from '../../constants/SERVER_URL';
import { Spinner } from "../spinner";
import {Button} from "flowbite-react";
import logo from '../../assets/logo.webp'
import useToast from '../../components/Toast'


const OrderDetails=()=>{
    const {show}=useToast()
    const {id}=useParams();
    const [Order,setOrder]=useState(null);
    const [loading,setIsLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{
        const fetchEmergecyOrderDetails=async()=>{
            try {
                const res=await fetch(`${SERVER_URL}/api/v1/order/emergency/${id}/`);
                const data=await res.json();
                if(res.ok){
                    setOrder(data);
                }else{
                    throw new Error(data.message || "Error fetching Worker info");
                }
            } catch (error) {
                setError(error.message)
            }finally{
                setIsLoading(false);
            };
        };

        fetchEmergecyOrderDetails();

    },[id])


    // re-assign order
    const handleReassign=async()=>{
    
    try {
        const res = await fetch(`${SERVER_URL}/api/v1/order/emergency/${id}/reassign`, {
        method: 'PATCH',
        });
            const data = await res.json();

            if(!data.success){
            show(data.message, "warning");
            console.log(data);
            }else{
                // window.location.reload();
                show("Order reassigned successfully!", "success");
                await new Promise(resolve=>setTimeout(resolve,3000))
                window.location.reload();
            }
            
        } catch (error) {
            // alert("Error",error.message);
            show(error.message, "error");
        }
    }

    if(loading) return (
        <div className="  w-80 mx-auto flex gap-4">
        <p>{<Spinner/>}</p>
        <p className="my-auto font-semibold text-cyan-700">Loading order details...</p>
        </div>
    )
    if(error) return <p className="text-red-600 text-center font-semibold">Error fetching order details!</p>

    return(
        <div>
            <div className="w-11/12 mx-auto bg-white">
            <div className="flex justify-center border border-cyan-300">
                <img src={logo} className="w-24 h-24"/>
                <h2 className="text-2xl font-semibold my-auto text-cyan-800">Fuel Mate</h2>
            </div>
            <div>
            <p className="text-center font-semibold text-gray-900 mt-4">Order Details</p>
            <div className="flex justify-between p-3 gap-6 w-11/12 mx-auto mt-4">
            <div>
            <ul className="flex flex-col gap-3">
                    <li>Customer Name: <span className="demographyLi">{Order?.order?.clientName}</span></li>
                    <li>Customer Phone No: <span className="demographyLi">{Order?.order?.clientPhone}</span></li>
                    <li>Fuel Type Requested: <span className="demographyLi">{Order?.order?.fuelType}</span></li>
                    <li>Volume Requested: <span className="demographyLi">{Order?.order?.fuelVolume} L</span></li>
                    <li>Order Status: <span className="demographyLi">{Order?.order?.status}</span></li>
                    <li>Urgency: <span className="demographyLi">{Order?.order?.urgency}</span></li>
                </ul>
            </div>

            <div>
            {/* customer message */}
            <div className="flex flex-col gap-4">
                <h2>Customer Message:</h2>
                <p className="border-2 p-5 rounded-md">
                    <span className="demographyLi text-base">{Order?.order?.message}</span>
                </p>
            </div>
            </div>
            {/* assigned station */}
            <div className="flex flex-col gap-4">
                <h2>Assigned Station:</h2>
                <div className="flex flex-row gap-10">
                <div>
                <img src={Order?.order?.assignedStation?.profileImg} className="w-[300px] h-[200px] object-cover"/>
                </div>
                <div>
                <ul className="flex flex-col gap-2">
                    <li>Station Name: <span className="demographyLi">{Order?.order?.assignedStation?.stationName}</span></li>
                    <li>Station Phone No: <span className="demographyLi">{Order?.order?.assignedStation?.phoneNo}</span></li>
                    <li>Station Location: <span className="demographyLi">{Order?.order?.assignedStation?.county} - {Order?.order?.assignedStation?.town}</span></li>
                    <li>Station Email: <span className="demographyLi">{Order?.order?.assignedStation?.email}</span></li>
                </ul>
                </div>
                </div>
            </div>
            </div>

            <div className="w-11/12 mx-auto pt-10 flex gap-6">
                <Button color={'warning'} onClick={handleReassign}>Re-Assign</Button>
            </div>

            <hr  className="mt-10"/>
            {/* assignment history */}
            <h2 className="pt-5">Order Assignment History</h2>
            <div className="mx-auto pt-5 flex gap-10 overflow-x-auto w-full">
                {
                    Order.order.assignmentHistory.length>0 && Order.order.assignmentHistory?.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
.map((order)=>(
                        <div key={order._id} className="pt-10 min-w-[320px] shrink-0">
                            <img src={order?.station?.profileImg} className="w-[300px] h-[200px] object-cover"/>
                            <ul className="pt-5">
                                <li>Station Name: <span className="demographyLi">{order?.station?.stationName}</span></li>
                                <li>Station Email: <span className="demographyLi">{order?.station?.email}</span></li>
                                <li>Phone No: <span className="demographyLi">{order?.station?.phoneNo}</span></li>
                                <li>Location: <span className="demographyLi">{order?.station?.county} - {order?.station?.town}</span></li>
                                <li>Status: <span className="demographyLi">{order?.status}</span></li>
                            </ul>
                        </div>
                    ))

                }
            </div>
            </div>
            </div>
        </div>
    )
}

export default OrderDetails;
