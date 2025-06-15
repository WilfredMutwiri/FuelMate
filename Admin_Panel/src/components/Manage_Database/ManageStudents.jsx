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


export default function ManageStudents() {
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
                            <h2 className="flex-1 mx-auto p-2 text-left text-l font-semibold text-cyan-700">Available Students</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Student's Name</Table.HeadCell>
                                    <Table.HeadCell>Parent Phone No</Table.HeadCell>
                                    <Table.HeadCell>Class</Table.HeadCell>
                                    <Table.HeadCell>Id No:</Table.HeadCell>
                                    <Table.HeadCell>Record</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {students && students.map((student) => (
                                        <Table.Row key={student._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {student.studentName}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {student.parentPhoneNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {student.studentClass}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                {student.studentAdmNo}
                                            </Table.Cell>
                                            <Table.Cell className="text-black">
                                                <Link to={`/student/${student._id}`}>
                                                <a href="#" className="font-medium text-cyan-700 hover:underline hover:text-red-600">View</a>
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>
                                                    <IoTrashOutline onClick={handleStudentDelete}className='text-red-600 cursor-pointer'/>
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
                {/* options div */}
                    <div className='bg-gray-100 p-4 rounded-md shadow-sm shadow-gray-400'>
                        <div className='bg-cyan-700 p-4 rounded-md'>
                            <FaUsers className='text-center text-2xl text-white mx-auto'/>
                            <h1 className='text-xl font-semibold text-white'>Total Students</h1>
                            <p className='text-sm text-white font-semibold'>{studentsAmount}</p>
                        </div>
                        <div className='bg-cyan-700 p-4 rounded-md mt-4'>
                            <h1 className='text-2xl font-semibold text-center text-white'>+</h1>
                            <Button className='text-xs w-full mt-2' outline onClick={() =>setOpenModal(true)}>Add New Student</Button>
                        </div>
                    </div>

            </div>
            {/* add new worker modal */}
            <div id='modalholder'>
            <Modal show={openModal} onClose={()=>setOpenModal(false)}>
                <Modal.Header>Add New Worker</Modal.Header>
            <Modal.Body>
            <div className="w-full">
            <div className="w-full md:w-10/12 mx-auto bg-gray-800 mt-4 p-3 rounded-md ">
            <form className="flex flex-col gap-2 " onSubmit={handleSubmit}>
                <Label value="Full Name" id="studentName" className="text-white"/>
                <TextInput 
                placeholder="Enter Student Name"
                type="text"
                required
                id='studentName'
                onChange={handleChange}
                />
                
                <Label value="Parent Name" id="parentName" className="text-white"/>
                <TextInput 
                placeholder="Enter Parent Name"
                required
                type="text"
                id='parentName'
                onChange={handleChange}
                />
                <Label value="parent Email" id="parentEmail" className="text-white"/>
                <TextInput 
                placeholder="Enter Parent's Email:"
                required
                id="parentEmail"
                type="email"
                onChange={handleChange}
                />
                <Label value='parent phone no:' id='parentPhoneNo' className='text-white'/>
                <TextInput
                placeholder='Parent Phone No:'
                required
                id='parentPhoneNo'
                type='text'
                onChange={handleChange}
                />
                <Label value='StudentID No:' id='studentAdmNo' className='text-white'/>
                <TextInput
                placeholder='Student Adm No:'
                required
                id='studentAdmNo'
                type='text'
                onChange={handleChange}
                />
                <Label value='Student Class' id='studentClass' className='text-white'/>
                <TextInput
                placeholder='Student Class'
                required
                id='studentClass'
                type='text'
                onChange={handleChange}
                />
                <Button className="w-full mt-4" outline type='submit' disabled={isloading}>
                    {
                        isloading ? 
                        <>
                        <Spinner size="sm"/>
                        <span className='ml-3 text-red-600'>Adding new Student...</span>
                        </>: "Add Student"
                    }
                </Button>
                {
                    serror && <Alert color="failure" className='text-black'>
                        {serror.message}
                    </Alert>
                }
                {
                    addSuccess &&
                    <Alert className='mt-4' color="success">
                        New Student Added Successfully!
                    </Alert>
                
                }
            </form>
            </div>
        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button  onClick={()=>setOpenModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
