import React from 'react'
import { Alert, Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import { useState } from 'react';
import {SERVER_URL} from '../../constants/SERVER_URL';
import {useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addTeacherStart,addTeacherSuccess,addTeacherFailure } from '../../../Redux/User/teacherSlice';
export default function TeachersUpdate() {
    const [formData,setFormData]=useState({});
    const [isloading,setIsLoading]=useState(false);
    const [error,setError]=useState(null);
    const [addSuccess,setAddSuccess]=useState(false);
    const Navigate=useNavigate();
    const dispatch=useDispatch();


    const handleReload=()=>{
        window.location.reload()
    }
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value.trim()})
    }
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
            handleReload()
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            setAddSuccess(false);
            dispatch(addTeacherFailure(error.message))
        }
    }
    return (
        <div className="w-full">
            <Button onClick={handleReload} outline>Back</Button>
            <div className="w-full md:w-6/12 mx-auto bg-cyan-950 mt-4 p-3 rounded-md ">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <Label value="Full Name" id="teacherName" className="text-white"/>
                <TextInput 
                placeholder="full name"
                type="text"
                onChange={handleChange}
                id='fullName'
                required
                />

                <Label value="email" id="teacherEmail" className="text-white"/>
                <TextInput 
                placeholder="teacher@gmail.com"
                type="email"
                onChange={handleChange}
                id='email'
                required
                />

                <Label value="phone number" id="teacherPhone" className="text-white"/>
                <TextInput 
                placeholder="+254700000000"
                type="text"
                onChange={handleChange}
                id='phoneNo'
                required
                />
                <Button className="w-full mt-4" type='submit' disabled={isloading} gradientDuoTone="pinkToOrange" outline>
                    {
                        isloading ?
                        <>
                        <Spinner size="sm"/>
                        <span className='ml-3 text-red-600'>Adding New Teacher...</span>
                        </> : 'Add new Teacher'
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
                        New Teacher Added Successfuly!
                    </Alert>
                }
            </form>
            </div>
        </div>
    );
}
