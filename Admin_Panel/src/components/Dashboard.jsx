import React from 'react'
import { useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { FaUsersLine } from "react-icons/fa6";
import { Button, Label } from 'flowbite-react';
import { FaRegClock } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { GiLovers } from "react-icons/gi";
import { FaUserSecret } from "react-icons/fa";
import { BiMessageCheck } from "react-icons/bi";
import { Progress } from "flowbite-react";
import userImg from '../images/userprofile.jpg'
import { Link } from 'react-router-dom';
import { PiStudent } from "react-icons/pi";
import { TbBuildingWarehouse } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";
import {SERVER_URL} from '../constants/SERVER_URL';
import BarChart from './charts/FinancialChart';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";


export default function Dashboard() {
    const {currentUser}=useSelector(state=>state.user)
    const [welcomeText,setWelcomeText]=useState("Welcome Back");

    const [teachersCount,setTeachersCount]=useState(0);
    const [parentsCount,setParentsCount]=useState(0);
    const [workersCount,setWorkersCount]=useState(0);
    const[studentsAmount,setStudentAmount]=useState(0);
    const [outdatedRecord,setOutdatedRecord]=useState(true);

        const [date,setDate]=useState(new Date());

        const handleDateChange = (selectedDate) => {
            setDate(selectedDate);
        }

    // get teachers count
    const getTeachersCount=async()=>{
        const response=await fetch(`${SERVER_URL}/api/users/teachersCount`);
        const data= await response.json();
        if(response.ok){
            setTeachersCount(data.teachersCount);
            setOutdatedRecord(false);
        }else{
            setOutdatedRecord(true);
            throw new data.error || "Error fetching teachers";
        }
    }
// get parents count
const getParentsCount=async()=>{
    const response=await fetch(`${SERVER_URL}/api/users/parentsCount`);
    const data= await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setParentsCount(data);
    }else{
        setOutdatedRecord(true);
        throw new data.error || "Error fetching parents"
    }
}

//get workers count
const getWorkersCount=async()=>{
    const response=await fetch(`${SERVER_URL}/api/users/workersCount`);
    const data=await response.json();
    if(response.ok){
        setOutdatedRecord(false);
        setWorkersCount(data);
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
        getTeachersCount();
        getParentsCount();
        getWorkersCount();
        getStudents();
    },[]);

    //total members
    const totalMembers=()=>{
    const teachersValue= teachersCount;
    const parentsValue=parentsCount;
    const workersValue=workersCount;
    const studentsValue=studentsAmount;
    let finalValue=teachersValue+parentsValue+workersValue+studentsValue;        
    return finalValue;
    };

  return (
    <div>

        <div className='pt-3 flex gap-4'>
            <div className='bg-gray-300 rounded-md shadow-md hover:shadow-none shadow-gray-400 flex-1'>
                <h2 className='font-bold text-2xl text-cyan-700 pt-4 text-center'>{welcomeText}</h2>
                <h2 className=' text-gray-800 text-center font-semibold text-lg'>@{currentUser.userName}</h2>
                <img src={userImg} className='rounded-full w-20 h-20 mx-auto'/>
                <h2 className=' text-cyan-700 text-center font-semibold text-sm pt-3'>You are logged in as an Admin</h2>
                <Button className='mx-auto mt-3'>Edit Profile</Button>
            </div>
            {/* components div */}
            <div className='flex flex-col gap-4'>
                {/* first div */}
                <div className='flex flex-row gap-4'>
                    {/* first div first container */}
                    {/* members div */}
                    <div className='bg-gray-300 p-3 rounded-md flex flex-col gap-4 shadow-md hover:shadow-none shadow-gray-400 flex-1'>
                    <FaUsersLine className='mx-auto w-auto h-10 text-cyan-700'/>
                    <h2 className='font-semibold text-xl text-black'>Total Members</h2>
                    <h3 className='text-2xl  font-semibold text-cyan-700'>{totalMembers()}</h3>
                    <Label className={`text-sm font-semibold ${outdatedRecord ?"text-red-700":"text-gray-700" }`}>{outdatedRecord ? "Outdated Record!" : "Includes all members in the system"}</Label>
                    </div>
                        {/* teachers div */}
                        <div className='bg-gray-300 p-3 rounded-md flex-1 gap-4 text-black shadow-md hover:shadow-none shadow-gray-400'>
                        <GiTeacher className='text-xl mx-auto w-auto h-10 text-cyan-700'/>
                        <h2 className='font-semibold text-xl pt-3'>Total Teachers</h2>
                        <h3 className='text-2xl font-semibold pt-3 text-cyan-700'>{teachersCount}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-sm font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "Current Record"}</p>
                        <Link to="/ManageTeachers">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>
                        {/* parents div */}
                        <div className='p-3 rounded-md flex-1 bg-gray-300 shadow-md hover:shadow-none shadow-gray-400'>
                        <GiLovers className='text-xl mx-auto w-auto h-10 text-cyan-700'/>
                        <h2 className='font-semibold text-xl pt-3 text-black'>Total Parents</h2>
                        <h3 className='text-2xl font-semibold pt-3 text-cyan-700'>{parentsCount}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-sm font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "Current Record"}</p>
                        <Link to="/manageParents">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                    </div>
                </div>
                {/* second div */}
                <div className='flex gap-4'>
                        {/* first container */}
                        {/* workers div */}
                        <div className='bg-gray-300 p-3 rounded-md shadow-md hover:shadow-none shadow-gray-400 flex-1'>
                        <FaUserSecret className='text-xl mx-auto w-auto h-10 text-cyan-700'/>
                        <h2 className='font-semibold text-lg pt-3 text-black'>Total Workers</h2>
                        <h3 className='text-2xl font-semibold pt-3 text-cyan-700'>{workersCount}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-sm font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "Current Record"}</p>
                        <Link to="/manageWorkers">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                        </div>
                        {/* second container */}
                        {/* recent messages */}
                        <div className='bg-gray-300 p-3 rounded-md shadow-md hover:shadow-none shadow-gray-400 flex-1'>
                        <PiStudent className='text-xl mx-auto w-auto h-10 text-cyan-700'/>
                        <h2 className='font-semibold text-lg pt-3'>Total Students</h2>
                        <h3 className='text-2xl font-semibold pt-3 text-cyan-700'>{studentsAmount}</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-sm font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "Current Record"}</p>
                        <Link to="/manageStudents">
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </Link>
                        </h2>
                        </div>

                        <div className='bg-gray-300 p-3 rounded-md shadow-md hover:shadow-none shadow-gray-400 flex-1'>
                        <TbBuildingWarehouse className='text-xl mx-auto w-auto h-10 text-cyan-700'/>
                        <h2 className='font-semibold text-lg pt-3'>Classes</h2>
                        <h3 className='text-2xl font-semibold pt-3 text-cyan-700'>20</h3>
                        <h2 className='flex justify-between pt-3 gap-4'>
                        <p className={`text-sm font-semibold ${outdatedRecord ? "text-red-700":"text-gray-700"}`}>{outdatedRecord ? "Outdated Record!" : "Current Record"}</p>
                        <h2 className='text-sm cursor-pointer bg-white text-cyan-700 font-semibold p-2 rounded-md hover:bg-cyan-700 hover:text-white'>View</h2>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
        {/* lower section */}
        <div className='mt-4 bg-gray-200 p-3 rounded-md  hover:shadow-none shadow-gray-400 flex gap-4 justify-between'>
            <div className=''>
                <BarChart/>
            </div>
            <div className=''>
                <Calendar onChange={handleDateChange} value={date} className="bg-gray-100 rounded-md"/>
            </div>
        </div>
    </div>
  )
}
