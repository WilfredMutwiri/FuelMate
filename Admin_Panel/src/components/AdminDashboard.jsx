import React from 'react'
import { IoMdClose } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
import logo from '../assets/schoolLogo.webp'
import { FaDatabase } from "react-icons/fa6";
import { GiLovers } from "react-icons/gi";
import { useSelector,useDispatch } from 'react-redux';
import { FaCaretDown } from "react-icons/fa";
import SchoolLogo from '../assets/schoolLogo.webp';

import { useRef, useState } from "react";

import TeachersSquare from "./Messages/TeachersSquare";
import ParentsSquare from "./Messages/ParentsSquare";
import WorkersSquare from "./Messages/WorkersSquare";
import UpdatePage from "./Manage_Database/ManageTeachers";
import { Button, ButtonGroup } from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';
import {SERVER_URL} from '../constants/SERVER_URL'
import { signoutSuccess } from '../../Redux/User/userSlice';
import Dashboard from './Dashboard';
import ManageTeachers from './Manage_Database/ManageTeachers';
import ManageParents from './Manage_Database/ManageParents';
export default function AdminDashboard() {
    const Navigate=useNavigate()
    const dispatch=useDispatch();
    const {currentUser}=useSelector(state=>state.user)
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
          const res=await fetch(SERVER_URL+'/api/auth/signout',{
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
                <div className={`flex flex-col justify-between -mt-7 bg-cyan-700 rounded-md shadow-sm shadow-pink-500 w-auto mb-5 md:mb-0 ${menuVisible ? 'block':'hidden'} h-auto`}>
                    <div className='p-4'>
                    <div className=''>
                        <img className='w-24 rounded-full mx-auto' src={logo} alt="profilePic"/>
                    </div>
                    <h2 className='text-center text-white p-3'>Destinykers High School</h2>
                    <div>
                        <p className='text-center text-sm italic text-white'>Learn To Inspire</p>
                    </div>
                    </div>
                    <div className='p-4 border-t-4 bg-cyan-700'>
                        <ul className='flex flex-col gap-5 text-center'>
                            <li onClick={()=>showSection('dashboard')} className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-pink-500 cursor-pointer flex          gap-3'><span><FaDatabase className="text-xl"/></span>Dashboard</li>

                            <Link to="/ManageTeachers">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-pink-500 cursor-pointer flex gap-3'><span><FaUsers className="text-xl"/></span>Manage Teachers</li>
                            </Link>

                            <Link to="/manageParents">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-pink-500 cursor-pointer flex gap-3'><span><FaUsers className="text-xl"/></span>Manage Parents</li>
                            </Link>
                            
                            <Link to="/manageWorkers">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-pink-500 cursor-pointer flex gap-3'><span><FaUsers className="text-xl"/></span>Manage Workers</li>
                            </Link>

                            <Link to="/manageStudents">
                            <li className='p-2 hover:bg-gray-100 rounded-md text-white hover:text-pink-500 cursor-pointer flex gap-3'><span><FaUsers className="text-xl"/></span>Manage Students</li>
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
                        <Dashboard/>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        </div>
    );
}

