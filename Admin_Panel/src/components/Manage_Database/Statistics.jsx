import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents } from '../../../Redux/User/studentSlice';
import { IoTrashOutline } from "react-icons/io5";
import {SERVER_URL} from '../../constants/SERVER_URL';
import { Alert, Button, Label, Spinner, TextInput,Table,Modal } from "flowbite-react";
import { addStudentFailure,addStudentStart,addStudentSuccess } from '../../../Redux/User/studentSlice';
import Sidebar from '../Sidebar';
import { FaUsers } from "react-icons/fa";
import { Link } from 'react-router-dom';


export default function Statistics() {
    const [formData,setFormData]=useState({});
    const [isloading,setIsLoading]=useState(false);
    const [isError,setError]=useState(null);
    const [addSuccess,setAddSuccess]=useState(false);
    const dispatch=useDispatch();
    const {students, sloading, serror } = useSelector(state => state.student);
    // modal
    const [openModal,setOpenModal]=useState(false);
    const[studentsAmount,setStudentAmount]=useState(0);
    // handle change function
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value.trim()})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError(false);
        setAddSuccess(false)
        try {
            dispatch(addStudentStart())
            const res=await fetch(SERVER_URL+"/api/users/addStudent",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data=await res.json();
            if(data.success===false){
                setAddSuccess(false)
                dispatch(addStudentFailure(data.message))
                return;
            }
            if(res.ok){
                dispatch(addStudentSuccess(data))
                setIsLoading(false);
                setError(null);
                setAddSuccess(true)
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            setAddSuccess(false)
            dispatch(addStudentFailure(error.message))
        }
    }

    //get students count
    const getStudents=async()=>{
        const response=await fetch(`${SERVER_URL}/api/users/studentsCount`);
        const data=await response.json();
        if(response.ok){
            setStudentAmount(data);
        }else{
            throw new data.error || "Error fetching students value";
        }
    } 
    useEffect(() => {
        dispatch(fetchStudents());
        getStudents();
    }, [dispatch]);

            //delete student
            const handleStudentDelete=async()=>{
                const response=await fetch(`${SERVER_URL}/api/users/deleteStudent/${students._id}`,{
                    method:"DELETE"
                });
                const data= await response.json();
                if(response.ok){
                    console.log("Student deleted ")
                }else{
                    console.log(data.error)
                }
            }    
    return (
        <div>
            <div className='flex justify-between gap-4 w-[95%]  mx-auto'>
                <div className=''>
                    <Sidebar/>
                </div>
                <div className="flex-1 gap-4 mt-4">
                    {/* Teachers div */}
                    <div className={`bg-gray-200 p-1 rounded-md`}>
                        <div className='flex justify-between bg-gray-200 rounded-md p-2'>
                            <h2 className="flex-1 mx-auto p-2 text-left text-l text-cyan-700">System Statistical Analysis</h2>
                        </div>

                        <div className="bg-white p-3">
                            {sloading &&
                                <>
                                    <Spinner size="sm" />
                                    <span className='ml-3'>Loading...</span>
                                </>
                            }
                            {
                                serror && <Alert className='mt-4' color="failure">{serror}</Alert>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
