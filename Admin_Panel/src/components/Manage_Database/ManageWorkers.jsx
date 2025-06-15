import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkers } from '../../../Redux/User/workerSlice';
import { IoTrashOutline } from "react-icons/io5";
import {SERVER_URL} from '../../constants/SERVER_URL';
import { Alert, Button, Label, Spinner, TextInput,Table,Modal } from "flowbite-react";
import { addWorkerFailure,addWorkerStart,addWorkerSuccess } from '../../../Redux/User/workerSlice';
import Sidebar from '../Sidebar';
import { FaUsers } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { Link } from 'react-router-dom';


export default function ManageWorkers() {
    const [formData,setFormData]=useState({});
    const [isloading,setIsLoading]=useState(false);
    const [error,setError]=useState(null);
    const [addSuccess,setAddSuccess]=useState(false);
    const dispatch=useDispatch();
    const { workers, w_loading, w_error } = useSelector(state => state.worker);
    // modal
    const [openModal,setOpenModal]=useState(false);
    // workers
    const [totalWorkers,setTotalWorkers]=useState(0);
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
            dispatch(addWorkerStart())
            const res=await fetch(SERVER_URL+"/api/users/addWorker",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data=await res.json();
            if(data.success===false){
                setAddSuccess(false)
                dispatch(addWorkerFailure(data.message))
                return;
            }
            if(res.ok){
                dispatch(addWorkerSuccess(data))
                setIsLoading(false);
                setError(null);
                setAddSuccess(true)
            }else if(!res.ok){
                dispatch(addWorkerFailure(data));
                setIsLoading(false);
                setError(data.message);
                setAddSuccess(false);
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            setAddSuccess(false)
            dispatch(addWorkerFailure(error.message))
        }
    }

    // get workers count
    const workersCount=async()=>{
        const response=await fetch(`${SERVER_URL}/api/users/workersCount`);
        const data=await response.json();
        if(response.ok){
            setTotalWorkers(data);
        }else{
            throw new data.error || "can't fetch workers' data";
        }
    }
    useEffect(() => {
        dispatch(fetchWorkers());
        workersCount();
    }, [dispatch]);

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
                            <h2 className="flex-1 mx-auto p-2 text-left text-lg font-semibold text-cyan-700">Available Workers</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Worker's Name</Table.HeadCell>
                                    <Table.HeadCell>Phone No</Table.HeadCell>
                                    <Table.HeadCell>Department</Table.HeadCell>
                                    <Table.HeadCell>Worker's Id No:</Table.HeadCell>
                                    <Table.HeadCell>Record</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {workers && workers.map((worker) => (
                                        <Table.Row key={worker._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {worker.fullName}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {worker.phoneNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {worker.Department}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {worker.workerId}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                <Link to={`/worker/${worker._id}`}>
                                                <a href="#" className="font-medium text-cyan-700 hover:text-red-600 hover:underline">View</a>
                                                </Link>
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
                            <hr />
                            <Label className='text-cyan-700' gradientDuoTone="pinkToOrange" outline>Show More </Label>
                            <div className="w-10/12 mx-auto mt-3">
                            </div>
                            {w_loading &&
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
                </div>
                {/* options div */}
                    <div className='bg-gray-100 p-4 rounded-md shadow-sm shadow-gray-400'>
                        <div className='bg-cyan-700 p-4 rounded-md'>
                            <FaUsers className='text-center text-2xl text-white mx-auto'/>
                            <h1 className='text-xl font-semibold text-white'>Total Workers</h1>
                            <p className='text-sm text-white font-semibold'>{totalWorkers}</p>
                        </div>
                        <div className='bg-cyan-700 p-4 rounded-md mt-4'>
                            <TiMessages className='text-center text-2xl text-white mx-auto'/>
                            <Button className='text-xs w-full mt-2' outline onClick={() =>setOpenModal(true)}>Send Message</Button>
                        </div>
                        <div className='bg-cyan-700 p-4 rounded-md mt-4'>
                            <h1 className='text-2xl font-semibold text-center text-white'>+</h1>
                            <Button className='text-xs w-full mt-2'outline onClick={() =>setOpenModal(true)}>Add New Worker</Button>
                        </div>
                    </div>

            </div>
            {/* add new worker modal */}
            <div id='modalholder'>
            <Modal show={openModal} onClose={()=>setOpenModal(false)}>
                <Modal.Header>Add New Worker</Modal.Header>
            <Modal.Body>
            <div className="w-full">
            <h2 className='text-center text-sm text-cyan-700'>Inputs with * are must be filled!</h2>
            <div className="w-full md:w-10/12 mx-auto mt-4 p-3 rounded-md  text-black">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className='flex flex-row gap-6 w-full'>
                <div className='flex-1'>
                    <Label value="Full Name*" id="workerName" className=""/>
                    <TextInput 
                    placeholder="Enter Full Name"
                    type="text"
                    onChange={handleChange}
                    id='fullName'
                    required
                    />
            
                    <Label value="Email*" id="workerEmail" className=""/>
                    <TextInput 
                    placeholder="Enter Email Address"
                    type="email"
                    onChange={handleChange}
                    id='email'
                    required
                    />
            
                    <Label value="Phone Number*" id="workerPhone" className=""/>
                    <TextInput 
                    placeholder="Enter Phone No:"
                    type="text"
                    onChange={handleChange}
                    id='phoneNo'
                    required
                    />
            
                    <Label value="Place Of Birth" id="placeOfBirth" className=""/>
                    <TextInput 
                    placeholder="Enter Place of Birth"
                    type="text"
                    onChange={handleChange}
                    id='placeOfBirth'
                    />
            
                    <Label value="National Id" id="nationalId" className=""/>
                    <TextInput 
                    placeholder="14567878"
                    type="number"
                    onChange={handleChange}
                    id='nationalId'
                    />
            
                    <Label value="Box Office" id="boxOffice" className=""/>
                    <TextInput 
                    placeholder="Enter Box Office"
                    type="text"
                    onChange={handleChange}
                    id='boxOffice'
                    />
            
                    <Label value="Marital Status" id="maritalStatus" className=""/>
                    <TextInput 
                    placeholder="Single"
                    type="text"
                    onChange={handleChange}
                    id='maritalStatus'
                    />
                </div>
            
                <div className='flex-1'>
                <Label value="Title*" id="title" className=""/>
                <TextInput 
                placeholder="Mr/Mrs"
                type="text"
                onChange={handleChange}
                id='title'
                required
                />
            
                <Label value="Sex" id="sex" className=""/>
                <TextInput 
                placeholder="Male/Female"
                type="text"
                onChange={handleChange}
                id='sex'
                />
            
                <Label value="Nationality*" id="nationality" className=""/>
                <TextInput 
                placeholder="Kenya"
                type="text"
                onChange={handleChange}
                id='nationality'
                required
                />
            
                <Label value="Department*" id="Department" className=""/>
                <TextInput 
                placeholder="Enter department of work"
                type="text"
                onChange={handleChange}
                id='Department'
                required
                />
            
                <Label value="Work Status" id="status" className=""/>
                <TextInput 
                placeholder="Active/Inactive/Pending"
                type="text"
                onChange={handleChange}
                id='status'
                />
            
                <Label value="Work ID*" id="workerId" className=""/>
                <TextInput 
                placeholder="Enter work ID"
                type="text"
                onChange={handleChange}
                id='workerId'
                required
                />
            
                <Label value="Religion" id="religion" className=""/>
                <TextInput 
                placeholder="Christian/Muslim/Hindu"
                type="text"
                onChange={handleChange}
                id='religion'
                />
                </div>
                            </div>
                            <div>
                            <Button className="w-full mt-4" type='submit' disabled={isloading} outline>
                                {
                                    isloading ?
                                    <>
                                    <Spinner size="sm"/>
                                    <span className='ml-3 text-red-600'>Adding New Worker...</span>
                                    </> : 'Add new Worker'
                                }
                            </Button>
                            {
                                error && 
                                <Alert color="failure">
                                    {error.message}
                                </Alert>
                            }
                            {
                                addSuccess && 
                                <Alert color="success">
                                    New Worker Added Successfuly!
                                </Alert>
                            }
                            </div>
                        </form>
                        </div>
        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>setOpenModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
