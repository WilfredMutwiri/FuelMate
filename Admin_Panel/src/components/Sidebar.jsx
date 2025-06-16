import { useSelector} from 'react-redux';
import { useState } from "react";
import { Button} from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp'
import { MdDashboard } from "react-icons/md";
import { MdOutlineEmergency } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { RiGasStationFill } from "react-icons/ri";
import { IoMdTrendingUp } from "react-icons/io";
import { CiNoWaitingSign } from "react-icons/ci";


const Sidebar = () => {
    const Navigate=useNavigate()
    const {currentUser}=useSelector(state=>state.user)
    const [menuVisible,setMenuVisible]=useState(true)
    const handleRevealMenu=()=>{
        setMenuVisible(!menuVisible)
    }
    const handleCloseMenu=()=>{
        setMenuVisible(!menuVisible)
    }
        const handleSignout=async()=>{
            // try {
            //   const res=await fetch(SERVER_URL+'/api/auth/signout',{
            //     method:"POST"
            //   })
            //   const data=await res.json();
            //   if(!res.ok){
            //     console.log(data.message);
            //   }else{
            //     dispatch(signoutSuccess());
            //   }
            //   Navigate('/Landing')
            // }
            // catch (error) {
            //   console.log(error.message);
            // }

          Navigate('/Landing')
          }
    return (
        <div>
            <div className={`flex flex-col justify-between mt-4 bg-gray-900 rounded-md shadow-sm shadow-pink-500 w-auto mb-5 md:mb-0 ${menuVisible ? 'block':'hidden'} h-auto`}>
                 <div className='p-4'>
                    <div className=''>
                        <img className='w-32 h-32 rounded-full mx-auto' src={logo} alt="profilePic"/>
                    </div>
                    <h2 className='text-center text-white p-3'>FuelMate</h2>
                    <p className='text-center text-sm italic text-white'>Your Fuel, Delivered Anywhere, Anytime
</p>
                    </div>
                    
                    <div className='p-4 border-t-4 bg-gray-900'>
                    <ul className='flex flex-col gap-5 text-center'>
                        <Link to="/admin">
                        <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-cyan-700 cursor-pointer flex gap-3'><span><MdDashboard className="text-xl"/></span>Dashboard</li>
                        </Link>

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

                        <Link to="/statistics">
                          <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-cyan-700 cursor-pointer flex gap-3'><span><IoMdTrendingUp className="text-xl"/></span>Statistics</li>
                        </Link>

                    </ul>
                        <Button className="w-full mt-4" outline onClick={handleSignout}>Exit</Button>
                </div>
                        <IoMdClose className="text-center mt-4 mx-auto block md:hidden" onClick={handleCloseMenu}/>
            </div>
        </div>
    )
}

export default Sidebar;