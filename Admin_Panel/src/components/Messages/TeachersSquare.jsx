import React from 'react'
import { Alert, Button, Label, Spinner, TextInput, Textarea,Modal,Checkbox } from "flowbite-react";
import { useState,useEffect } from 'react';
import { SERVER_URL } from '../../constants/SERVER_URL';
import { fetchTeachers } from '../../../Redux/User/teacherSlice';
import { useSelector,useDispatch} from 'react-redux';
import { IoSearchOutline } from "react-icons/io5";
import Sidebar from '../Sidebar';

export default function TeachersSquare() {
    const dispatch=useDispatch();
    const {teachers,loading,error}=useSelector(state=>state.teacher);
    const [formData,setFormData]=useState({});
    const [isloading,setLoading]=useState(false);
    const [smsSuccess,setSmsSuccess]=useState(false);
    const [isError,setIsError]=useState("");
    const [openModal,setOpenModal]=useState(false)
    const [openSpecialTeacherModal,setSpecialTeacherModalOpen]=useState(false)

    useEffect(()=>{
        dispatch(fetchTeachers());
    },[dispatch])

    // check phone number validity
    const validPhoneNo=(phonenumber)=>{
        const regex = /^\+254\d{9}$/
        return regex.test(phonenumber)
    }
    // +254774529458
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value.trim()})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setSmsSuccess(false);
        setIsError(false);

        if(!formData ||
            !formData.message ||
            formData==="" ||
            formData.message===""
        ){
            setLoading(false)
           return setIsError("Can't send empty message")
        }else if(!formData.phoneNo || !formData.phoneNo===""){
            setLoading(false);
            return setIsError("Kindly select a recipient!")
        }
        else if(!validPhoneNo(formData.phoneNo)){
            setLoading(false);
            return setIsError("Invalid Phone number")
        }
        try {
            const res=await fetch(SERVER_URL+'/api/sms/sendSMS',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data=await res.json();
            if(!res.ok){
                setIsError(data.message || "An error occured")
                setLoading(false);
                return;
            }
            setSmsSuccess(true);
            setLoading(false)
            setSmsSuccess("Message sent successfully!");
        } catch (error) {
            setIsError(error.message);
            setLoading(false)
        }
    }
    return (
        <div className='flex justify-between gap-4 w-[95%]  mx-auto'>
            <div>
                <Sidebar/>
            </div>
            <div className="bg-gray-300 rounded-md p-3 w-full mt-4 flex-1 gap-4">
                <h2 className="text-center font-semibold text-orange-500">Teachers Square</h2>
                <form onSubmit={handleSubmit}>
                    <div className="block md:flex gap-6">
                    <div className=" pt-3 flex flex-col gap-4 flex-1">
                        <h2>Send Message to:</h2>
                        <div className="">
                        <Button className="w-full" onClick={()=>setOpenModal(true)}>All Teachers</Button>
                        </div>
                        <hr />
                        <div>
                            <Label value="All Teachers Except"/>
                            <Button className='w-full mt-3' onClick={()=>setSpecialTeacherModalOpen(true)}>Select</Button>
                        </div>
                        <hr />
                        <div>
                        <Label value="Special Teacher"/>
                        <TextInput 
                        type="text"
                        className="mt-2 mb-2"
                        placeholder="+2540700000000"
                        id='phoneNo'
                        onChange={handleChange}
                        />
                        </div>
                        </div>
                        <div className="flex-1">
                        <Textarea 
                                    className="w-full h-72 mt-4" 
                                    placeholder="Dear Sir/Madam, you are hearby notified that..."
                                    id='message'
                                    onChange={handleChange}/>
                                    <Button className="w-full mt-3" gradientDuoTone="pinkToOrange" disabled={loading} outline type='submit'>
                                        {
                                            isloading ?
                                            (
                                            <>
                                            <Spinner size="sm"/>
                                            <span className='ml-3 text-red-600'>Sending message...</span>
                                            </>
                                            ):'Send Message'
                                        }
                                    </Button>
                                    {
                                        isError && 
                                        <Alert color="failure" className='mt-4'>
                                            {isError}
                                        </Alert>
                                    }
                                    {
                                        smsSuccess &&
                                        <Alert color="success" className='mt-4'>
                                            {smsSuccess}
                                        </Alert>
                                    }
                                </div>
                        </div>
                </form>
            </div>
            {/* all teachers modal */}
            <section>
                <Modal show={openModal} onClose={()=>setOpenModal(false)}>
                    <Modal.Header>Send Message To All Teachers</Modal.Header>
                    <Modal.Body>
                    <div className='block md:flex justify-between gap-4'>
                    <div className='flex-1'>
                        <h2 className='text-center'>Available Teachers</h2>
                        <p className='text-sm italic text-cyan-800 pb-2'>(Send Message to all the listed teachers)</p>
                        <hr />
                        <div>
                        <ul className="flex flex-col gap-4 p-3">
                        {teachers && teachers.map((teacher) => (
                            <li className='block gap-4 md:flex justify-between' key={teacher._id}>
                                <h2>{teacher.fullName}</h2>
                                <h3 className='text-black'>{teacher.phoneNo}</h3>
                            </li>
                        ))}
                        </ul>
                        <div className=" p-2 mt-4 rounded-md">
                        <div className=" mx-auto mt-3">
                        <Button className='mx-auto w-full'  gradientDuoTone="pinkToOrange" outline>Show More</Button>
                        </div>
                        <div className="w-10/12 mx-auto mt-3">
                        </div>
                        {loading && 
                        <>
                        <Spinner size="sm"/>
                        <span className='ml-3'>Loading...</span>
                        </>
                        }
                        {
                        error && <Alert className='mt-4' color="failure">{error}</Alert>
                        }
                        </div>
                      </div>

                    </div>
                    <div className='flex-1'>
                            <Textarea 
                                    className="w-full h-72 mt-4" 
                                    placeholder="Greetings. You are hearby notified that..."
                                    id='message'
                            />
                            <Button className='mt-3 w-full' outline gradientDuoTone="pinkToOrange">Send Message</Button>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button gradientDuoTone="pinkToOrange" onClick={()=>setOpenModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </section>
            {/* special teacher modal section */}
            <section>
                <Modal show={openSpecialTeacherModal} onClose={()=>setSpecialTeacherModalOpen(false)}>
                    <Modal.Header>Send Message To All Teachers Except</Modal.Header>
                    <Modal.Body>
                    <div className='block md:flex gap-4 justify-between'>
                        <div className='flex-1'>
                        <h2 className='text-center'>Available Teachers</h2>
                        <h2 className='text-center italic text-sm text-red-600 p-1'>( Selected teachers won't receive message )</h2>
                        <hr />
                        <div>
                        <ul className="flex flex-col gap-4 p-3">
                        {teachers && teachers.map((teacher) => (
                            <li className='block gap-4 md:flex justify-between' key={teacher._id}>
                                <h2>{teacher.fullName}</h2>
                                <h3 className='text-black'>{teacher.phoneNo}</h3>
                                <Checkbox id='ignore'/>
                            </li>
                        ))}
                       </ul>
                       <div className=" p-2 mt-4 rounded-md">
                        <div className=" mx-auto mt-3">
                        <Button className='mx-auto w-full'  gradientDuoTone="pinkToOrange" outline>Show More</Button>
                        </div>
                        <div className="w-10/12 mx-auto mt-3">
                        </div>
                        {loading && 
                        <>
                        <Spinner size="sm"/>
                        <span className='ml-3'>Loading...</span>
                        </>
                        }
                        {
                        error && <Alert className='mt-4' color="failure">{error}</Alert>
                        }
                    </div>
                </div>

                </div>
                <div className='flex-1'>
                <Textarea 
                    className="w-full h-72 mt-4" 
                    placeholder="Greetings. You are hearby notified that..."
                    id='message'
                />
                <Button className='mt-3 w-full' outline gradientDuoTone="pinkToOrange">Send Message</Button>
                </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button gradientDuoTone="pinkToOrange" onClick={()=>setSpecialTeacherModalOpen(false)}>Cancel</Button>
                </Modal.Footer>
                </Modal>
            </section>
        </div>
    );
}