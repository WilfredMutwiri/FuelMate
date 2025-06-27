import { IoMdClose } from "react-icons/io";
import logo from '../assets/logo.webp'
import { useSelector,useDispatch } from 'react-redux';
import { FaCaretDown } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdOutlineEmergency } from "react-icons/md";
import { RiGasStationFill } from "react-icons/ri";
import { FcApproval } from "react-icons/fc";
import { useState } from "react";
import { Button} from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';
import {SERVER_URL} from '../constants/SERVER_URL'
import { signoutSuccess } from '../../Redux/User/userSlice';
import DashboardView from './DashboardView.jsx';
import { CiNoWaitingSign } from "react-icons/ci";


export default function AdminDashboard() {
    const Navigate=useNavigate()
    const dispatch=useDispatch();
    const [visibleSection,setVisibleSection]=useState('dashboard')
    const [menuVisible,setMenuVisible]=useState(true)
    const handleRevealMenu=()=>{
        setMenuVisible(!menuVisible)
    }
    const handleCloseMenu=()=>{
        setMenuVisible(!menuVisible)
    }
    const showSection=(section)=>{
        setVisibleSection(section)
    }
    const handleSignout=async()=>{
        try {
          const res=await fetch(SERVER_URL+'/api/v1/signout',{
            method:"POST"
          })
          const data=await res.json();
          if(!res.ok){
            console.log(data.message);
          }else{
            dispatch(signoutSuccess());
          }
          Navigate('/Landing')
        }
        catch (error) {
          console.log(error.message);
        }
    }

    return (
        <div className='bg-gray-100'>
            <hr />
            <div className=" w-full overflow-hidden ">
            <div className="flex justify-between">
            <div className="flex md:hidden w-full">
                <FaCaretDown className="text-3xl text-black block md:hidden ml-2 mt-4" onClick={handleRevealMenu}/>
            </div>
            </div>
            </div>
            <section>
                <div className="block md:flex w-[95%] m-auto mt-10 gap-5 md:gap-10">
                    {/* left section */}
                <div className={`flex flex-col justify-between -mt-7 bg-gray-950 rounded-md shadow-sm shadow-pink-500 w-auto mb-5 md:mb-0 ${menuVisible ? 'block':'hidden'} h-auto`}>
                    <a href="/admin">
                    <div className='p-4'>
                    <div className=''>
                        <img className='w-44 rounded-full mx-auto' src={logo} alt="profilePic"/>
                    </div>
                    <h2 className='text-center text-3xl text-white p-3'>FuelMate</h2>
                    <div>
                    <p className='text-center text-sm italic text-white'>Your Fuel, Delivered Anywhere, Anytime
</p>
                    </div>
                    </div>
                    </a>
                    <div className='p-4 border-t-4 bg-gray-950'>
                        <ul className='flex flex-col gap-5 text-center'>
                            <li onClick={()=>showSection('dashboard')} className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-cyan-700 cursor-pointer flex gap-3'><span><MdDashboard  className="text-xl"/></span>Dashboard</li>

                            <Link to="/EmergencyRequests">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-cyan-700 cursor-pointer flex gap-3'><span><MdOutlineEmergency className="text-xl"/></span>Emergency Requests</li>
                            </Link>

                            <Link to="/ApprovedStations">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-cyan-700 cursor-pointer flex gap-3'><span><FcApproval className="text-xl"/></span>Approved Stations</li>
                            </Link>


                            <Link to="/PendingApprovals">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-cyan-700 cursor-pointer flex gap-3'><span><CiNoWaitingSign className="text-xl"/></span>Pending Approvals</li>
                            </Link>
                            
                            <Link to="/RegisteredStations">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-cyan-700 cursor-pointer flex gap-3'><span><RiGasStationFill className="text-xl"/></span>Registered Stations</li>
                            </Link>
                        </ul>
                        <Button className="w-full mt-4" outline onClick={handleSignout}>Exit</Button>
                    </div>
                    <IoMdClose className="text-center mt-4 mx-auto block md:hidden" onClick={handleCloseMenu}/>
                </div>

                {/* right section */}
                <div className=" flex-1">
                    <div className=''>
                    {/* dashboard */}
                    <div className={visibleSection==='dashboard'?'':'hidden'}>
                        <DashboardView/>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        </div>
    );
}

