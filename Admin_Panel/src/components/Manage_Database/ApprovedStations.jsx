import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchParents } from '../../../Redux/User/parentSlice';
import { IoTrashOutline } from "react-icons/io5";
import {SERVER_URL} from '../../constants/SERVER_URL';
import { Alert, Button, Label, Spinner, TextInput,Table,Modal } from "flowbite-react";
import { addParentFailure,addParentStart,addParentSuccess } from '../../../Redux/User/parentSlice';
import Sidebar from '../Sidebar';
import { FaUsers } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";

export default function ApprovedStations() {
    const [formData,setFormData]=useState({});
    const [isloading,setIsLoading]=useState(false);
    const [isError,setError]=useState(null);
    const [addSuccess,setAddSuccess]=useState(false);
    const dispatch=useDispatch();
    const { parents, loading, error } = useSelector(state => state.parent);
    // modal
    const [openModal,setOpenModal]=useState(false);
    // parents
    const [parentsCount,setParentsCount]=useState(0);
    const [showAll,setShowAll]=useState(false);
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
            dispatch(addParentStart())
            const res=await fetch(SERVER_URL+"/api/users/addParent",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data=await res.json();
            if(data.success===false){
                setAddSuccess(false)
                dispatch(addParentFailure(data.message))
                return;
            }
            if(res.ok){
                dispatch(addParentSuccess(data))
                setIsLoading(false);
                setError(null);
                setAddSuccess(true)
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            setAddSuccess(false)
            dispatch(addParentFailure(error.message))
        }
    }

    //get parents
    const getParentsCount=async()=>{
        const response=await fetch(`${SERVER_URL}/api/users/parentsCount`);
        const data=await response.json();
        if(response.ok){
            setParentsCount(data);
        }else{
            throw new data.error || "Error fetching parents";
        }
    } 
    // use effect
    useEffect(() => {
        dispatch(fetchParents());
        getParentsCount();
    }, [dispatch]);

    //toggle height
    const toggleHeight=()=>{
        setShowAll(!showAll)
    }
    return (
        <div>
            <div className='flex justify-between gap-4 w-[95%]  mx-auto'>
                <div className=''>
                    <Sidebar/>
                </div>
                <div className="flex-1 gap-4 mt-4">
                    {/* Teachers div */}
                    <div className={`bg-gray-200 p-1 rounded-md overflow-hidden ${showAll?"h-[500px]":"h-auto"}`}>
                        <div className='flex justify-between bg-gray-200 rounded-md p-2'>
                            <h2 className="flex-1 mx-auto p-2 text-left text-lg text-cyan-700">Approved Fuel Stations</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Station Name</Table.HeadCell>
                                    <Table.HeadCell>Location</Table.HeadCell>
                                    <Table.HeadCell>Registration Number</Table.HeadCell>
                                    <Table.HeadCell>Business Certificate</Table.HeadCell>
                                    <Table.HeadCell>Station Phon No:</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {parents && parents.map((parent) => (
                                        <Table.Row key={parent._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {parent.fullName}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {parent.phoneNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {parent.studentName}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {parent.studentAdmNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                            <a href="#" className="font-medium text-cyan-700 hover:text-red-600 hover:underline">View</a>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <a href="#" className="font-medium text-red-600 hover:underline dark:text-cyan-500">
                                                    <IoTrashOutline/>
                                                </a>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                        <div className="bg-white p-3">

                            {loading &&
                                <>
                                    <Spinner size="sm" />
                                    <span className='ml-3'>Loading...</span>
                                </>
                            }
                            {
                                error && <Alert className='mt-4' color="failure">{error}</Alert>
                            }
                        </div>
                    </div>
                    <div className='z-50 relative p-3 rounded-md border-b-2 border-gray-300'>
                    <Label onClick={toggleHeight} className='text-white bg-cyan-900 p-2 mt-3 rounded-md' gradientDuoTone="pinkToOrange" outline>{showAll?"Show All":"Show Less"}</Label>
                    </div>
                </div>
            </div>
        </div>
    );
}
