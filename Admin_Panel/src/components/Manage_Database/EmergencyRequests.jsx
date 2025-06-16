import React, { useEffect, useState } from 'react';
import { Alert, Button, Label, Modal, Spinner,Table,TextInput} from "flowbite-react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeachers } from '../../../Redux/User/teacherSlice';
import { IoTrashOutline } from "react-icons/io5";
import {SERVER_URL} from '../../constants/SERVER_URL';
import { addTeacherStart,addTeacherSuccess,addTeacherFailure } from '../../../Redux/User/teacherSlice';
import Sidebar from '../Sidebar';
import { TiMessages } from 'react-icons/ti';
import { FaUsers } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function EmergencyRequests() {
    const [formData,setFormData]=useState({});
    const [isloading,setIsLoading]=useState(false);
    const [isError,setError]=useState(null);
    const [addSuccess,setAddSuccess]=useState(false);
    const dispatch=useDispatch();
    const [visibleSection, setVisibleSection] = useState('dashboard');
    const { teachers, loading, error } = useSelector(state => state.teacher);
    
    // modal
    const [openModal,setOpenModal]=useState(false);
    // teachers count
    const [teachersCount,setTeachersCount]=useState(0);
    // handle change function
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value.trim()})
    }
    // handle submit function
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setAddSuccess(false);
        try {
            dispatch(addTeacherStart())
            const res=await fetch(SERVER_URL+'/api/users/addTeacher',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            })
            const data=await res.json();
            if(data.success===false){
                dispatch(addTeacherFailure(data.message))
                return;
            }
            if(res.ok){
                dispatch(addTeacherSuccess(data))
                setIsLoading(false);
                setError(false);
                setAddSuccess(true);
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            setAddSuccess(false);
            dispatch(addTeacherFailure(error.message))
        }
    }

    // get number of teachers
    const getTeachersCount=async()=>{
        const response=await fetch(`${SERVER_URL}/api/users/teachersCount`);
        const data=await response.json();

        if(response.ok){
            setTeachersCount(data.teachersCount);
        }else{
            throw new data.error || "Error fetching teachers";
        }
    }
    // useeffect
    useEffect(() => {
        dispatch(fetchTeachers());
        getTeachersCount();
    }, [dispatch]);

    //delete teacher
    const handleTeacherDelete=async()=>{
        const response=await fetch(`${SERVER_URL}/api/users/deleteTeacher/${teachers._id}`);
        const data=response.json();
        if(response.ok){
            console.log("Teacher deleted ")
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
                            <h2 className="flex-1 mx-auto p-2 text-left text-lg text-cyan-700">Available Emergency Fuel Requests</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Client Phone No:</Table.HeadCell>
                                    <Table.HeadCell>Fuel Volume</Table.HeadCell>
                                    <Table.HeadCell>Urgency</Table.HeadCell>
                                    <Table.HeadCell>Location</Table.HeadCell>
                                    <Table.HeadCell>Nearby Station</Table.HeadCell>
                                    <Table.HeadCell>Assigned Station</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {teachers && teachers.map((teacher) => (
                                        <Table.Row key={teacher._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {teacher.fullName}
                                            </Table.Cell>
                                            <Table.Cell className="text-cyan-700">
                                                {teacher.email}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {teacher.phoneNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                            <Link to={`/teacher/${teacher._id}`}>
                                            <a href="#" className="font-medium text-cyan-700 hover:underline hover:text-red-600">View</a>
                                            </Link>
                                            </Table.Cell>
                                            <Table.Cell onClick={handleTeacherDelete}>
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
                </div>
            </div>
        </div>
    );
}
