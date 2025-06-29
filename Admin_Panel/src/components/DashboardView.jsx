import React,{ useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Label } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {SERVER_URL} from '../constants/SERVER_URL';
import "react-calendar/dist/Calendar.css";
import { RiGasStationFill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { GoAlert } from "react-icons/go";
import { FcApproval } from "react-icons/fc";
import { CiNoWaitingSign } from "react-icons/ci";
import { ImCross } from "react-icons/im";


export default function DashboardView() {
    const {currentUser}=useSelector(state=>state.user)
    const [welcomeText,setWelcomeText]=useState("Welcome Back");

    const [stationsCount,setStationsCount]=useState(0);
    const [ordersCount,setOrdersCount]=useState(0);
    const [approvedStationsCount,setApprovedStationsCount]=useState(0);
    const [notApprovedStationsCount,setNotApprovedStationsCount]=useState(0);

    const[emergencyOrdersCount,setEmergencyOrdersCount]=useState(0);
    const [pendingEmergencyOrders,setPendingEmergencyOrders]=useState(0);
    const [cancelledEmergencyOrders,setCancelledEmergencyOrders]=useState(0);
    const [assignedEmergencyOrders,setAssignedEmergencyOrders]=useState(0);

    const [outdatedRecord,setOutdatedRecord]=useState(true);

        const [date,setDate]=useState(new Date());

        const handleDateChange = (selectedDate) => {
            setDate(selectedDate);
        }

    // get stations count
    const getStationsCount=async()=>{
        const response=await fetch(`${SERVER_URL}/api/v1/Station/all`);
        const data= await response.json();
        if(response.ok){
            setStationsCount(data.totalStations);
            setOutdatedRecord(false);
        }else{
            setOutdatedRecord(true);
            throw new data.error || "Error fetching stations";
        }
    }

// get orders count
const getOrdersCount=async()=>{
    const response=await fetch(`${SERVER_URL}/api/v1/order/all`);
    const data= await response.json();
    console.log("orders data",data)
    if(response.ok){
        setOutdatedRecord(false);
        setOrdersCount(data.totalOrders);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching parents"
    }
}

//get all approved stations count
const getApprovedStationsCount=async()=>{
    const response=await fetch(`${SERVER_URL}/api/v1/station/approved`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setApprovedStationsCount(data.totalStations);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching parents";
    }

}

//get all approved stations count
const getNotApprovedStationsCount=async()=>{
    const response=await fetch(`${SERVER_URL}/api/v1/station/not-approved`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setNotApprovedStationsCount(data.totalStations);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching parents";
    }

}

//get students count
const getStudents=async()=>{
    const response=await fetch(`${SERVER_URL}/api/users/studentsCount`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setStudentAmount(data);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching students value";
    }
}

//get emergency orders count
const getEmergencyOrdersCount=async()=>{
    const response=await fetch(`${SERVER_URL}/api/v1/order/emergency/all`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setEmergencyOrdersCount(data.totalOrders);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching students value";
    }
} 

//get pending emergency orders count
const getPendingEmergencyOrders=async()=>{
    const response=await fetch(`${SERVER_URL}/api/v1/order/emergency/status/pending`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setPendingEmergencyOrders(data.totalOrders);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching students value";
    }
} 

//get accepted emergency orders count
const getAssignedEmergencyOrders=async()=>{
    const response=await fetch(`${SERVER_URL}/api/v1/order/emergency/status/accepted`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setAssignedEmergencyOrders(data.totalOrders);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching students value";
    }
} 

//get rejected emergency orders count
const getCancelledEmergencyOrders=async()=>{
    const response=await fetch(`${SERVER_URL}/api/v1/order/emergency/status/rejected`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setCancelledEmergencyOrders(data.totalOrders);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching students value";
    }
} 

useEffect(()=>{
    const getTimeOfDay=()=>{
        const hours=new Date().getHours();
        if(hours<12){
            return 'Good Morning'
        }else if(hours<18){
            return 'Good Afternoon'
        }else{
            return 'Good Evening'
        }
    }
        setWelcomeText(getTimeOfDay())
        getStationsCount();
        getOrdersCount();
        getApprovedStationsCount();
        getNotApprovedStationsCount();
        getStudents();
        getEmergencyOrdersCount();
        getPendingEmergencyOrders();
        getAssignedEmergencyOrders();
        getCancelledEmergencyOrders();
},[]);


  return (
    <div>
        <h2 className='text-lg text-cyan-700'>{welcomeText} {currentUser?.user?.username || Admin}!</h2>
        <div className='pt-3'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-row gap-4 justify-between'>

                    <div className='bg-gray-300 p-3 rounded-md flex flex-col gap-4 shadow-md hover:shadow-none shadow-gray-400 flex-1'>
                    <RiGasStationFill className='mx-auto w-auto h-10 text-cyan-700'/>
                    <h2 className='font-semibold text-lg text-center text-black'>Total Stations</h2>
                    <h3 className='text-4xl text-center  font-semibold text-cyan-700'>{stationsCount || 0}</h3>
                    <Label className={`text-xs text-center font-semibold ${outdatedRecord ?"text-red-700":"text-gray-700" }`}>{outdatedRecord ? "Error fetching Stations!" : "All registered stations"}</Label>
                    </div>

                    <div className='bg-gray-300 p-3 rounded-md flex-1 gap-4 text-black shadow-md hover:shadow-none shadow-gray-400'>
                        <FaShoppingCart className='text-xl mx-auto w-auto h-10 text-green-700'/>
                        <h2 className='font-semibold text-lg pt-3 text-center'>Total Orders</h2>
                        <h3 className='text-4xl font-semibold pt-3 text-green-800 text-center'>{ordersCount || 0}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-xs font-semibold pt-2  ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Error fetching orders!" : "Orders made via the app"}</p>
                        <Link to="/AllNormalOrders">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>

                    <div className='p-3 rounded-md flex-1 bg-gray-300 shadow-md hover:shadow-none shadow-gray-400'>
                        <GoAlert  className='text-xl mx-auto w-auto h-10 text-red-700'/>
                        <h2 className='font-semibold text-lg pt-3 text-black text-center'>Emergency Requests</h2>
                        <h3 className='text-4xl text-center font-semibold pt-3 text-red-800'>{emergencyOrdersCount}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-xs font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "All Emergency Requests"}</p>
                        <Link to="/EmergencyRequests">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>
                </div>
                
                {/* second collection */}
                <div className='flex flex-row gap-4 justify-between'>
                    <div className='p-3 rounded-md flex-1 bg-gray-300 shadow-md hover:shadow-none shadow-gray-400'>
                        <ImCross className='text-xl mx-auto w-auto h-8 pt-2 text-red-700'/>
                        <h2 className='font-semibold text-lg text-center pt-3 text-black'>Rejected Emergency Orders</h2>
                        <h3 className='text-4xl text-center font-semibold pt-3 text-red-800'>{cancelledEmergencyOrders}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-xs pt-2 font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "All rejected Orders"}</p>
                        <Link to="/RejectedEmergencyRequests">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>

                    <div className='p-3 rounded-md flex-1 bg-gray-300 shadow-md hover:shadow-none shadow-gray-400'>
                        <CiNoWaitingSign className='text-xl mx-auto w-auto h-10 text-yellow-700'/>
                        <h2 className='font-semibold text-lg text-center pt-3 text-black'>Pending Emergency Orders</h2>
                        <h3 className='text-4xl text-center font-semibold pt-3 text-yellow-600'>{pendingEmergencyOrders}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-xs pt-2 font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "All pending orders"}</p>
                        <Link to="/PendingEmergencyRequests">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>


                    <div className='p-3 rounded-md flex-1 bg-gray-300 shadow-md hover:shadow-none shadow-gray-400'>
                        <FcApproval className='text-xl mx-auto w-auto h-10'/>
                        <h2 className='font-semibold text-lg text-center pt-3 text-black'>Accepted Emergency Orders</h2>
                        <h3 className='text-4xl text-center font-semibold pt-3 text-green-700'>{assignedEmergencyOrders}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-xs pt-2 font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "All accepted orders"}</p>
                        <Link to="/AcceptedEmergencyRequests">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>
                </div>

                {/* second collection */}
                <div className='flex flex-row gap-4 justify-between'>
                    <div className='p-3 rounded-md flex-1 bg-gray-300 shadow-md hover:shadow-none shadow-gray-400'>
                        <FcApproval className='text-xl mx-auto w-auto h-10 text-cyan-700'/>
                        <h2 className='font-semibold text-lg text-center pt-3 text-black'>Approved Stations</h2>
                        <h3 className='text-4xl text-center font-semibold pt-3 text-green-800'>{approvedStationsCount}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-xs pt-2 font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "All approved stations"}</p>
                        <Link to="/ApprovedStations">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>


                    <div className='p-3 rounded-md flex-1 bg-gray-300 shadow-md hover:shadow-none shadow-gray-400'>
                        <CiNoWaitingSign className='text-xl mx-auto w-auto h-10 text-yellow-500'/>
                        <h2 className='font-semibold text-lg text-center pt-3 text-black'>Pending Stations Approvals</h2>
                        <h3 className='text-4xl text-center font-semibold pt-3 text-yellow-500'>{notApprovedStationsCount}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-xs pt-2 font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "Stations awaiting approval"}</p>
                        <Link to="/PendingApprovals">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
        {/* lower section */}
        <div className='mt-4 bg-gray-200 p-3 rounded-md  hover:shadow-none shadow-gray-400 flex gap-4 justify-between'>
        </div>
    </div>
  )
}
