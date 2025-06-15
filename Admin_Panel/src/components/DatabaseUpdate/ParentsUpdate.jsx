import React from 'react'
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from 'react';
import { addParentFailure,addParentStart,addParentSuccess } from '../../../Redux/User/parentSlice';
import { SERVER_URL } from '../../constants/SERVER_URL';
import { useDispatch } from 'react-redux';
export default function ParentsUpdate() {
    const dispatch = useDispatch()
    const [isLoading,setIsLoading]=useState(false);
    const [formData,setFormData]=useState({});
    const [error,setError]=useState(null);
    const [addSuccess,setAddSuccess]=useState(false)
    const handleReload=()=>{
        window.location.reload()
    }
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
            handleReload()
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
            setAddSuccess(false)
            dispatch(addParentFailure(error.message))
        }
    }
    return (
        <div className="w-full">
            <Button onClick={handleReload} type="submit" outline>Back</Button>
            <div className="w-full md:w-6/12 mx-auto bg-cyan-950 mt-4 p-3 rounded-md">
            <form className="flex flex-col gap-2 " onSubmit={handleSubmit}>
                <Label value="Full Name" id="parentName" className="text-white"/>
                <TextInput 
                placeholder="Parent full name"
                type="text"
                required
                id='fullName'
                onChange={handleChange}
                />
                
                <Label value="Parent Email" id="email" className="text-white"/>
                <TextInput 
                placeholder="parent@gmail.com"
                required
                type="email"
                id='email'
                onChange={handleChange}
                />
                <Label value="phone number" id="phoneNo" className="text-white"/>
                <TextInput 
                placeholder="+254700000000"
                required
                id="phoneNo"
                type="text"
                onChange={handleChange}
                />
                <Label value='Student Name' id='stdName' className='text-white'/>
                <TextInput
                placeholder='John Kimani'
                required
                id='studentName'
                type='text'
                onChange={handleChange}
                />
                <Label value='Student Admission No:' id='stdAdmNo' className='text-white'/>
                <TextInput
                placeholder='STD001'
                required
                id='studentAdmNo'
                type='text'
                onChange={handleChange}
                />
                <Button className="w-full mt-4" gradientDuoTone="pinkToOrange" outline type='submit' disabled={isLoading}>
                    {
                        isLoading ? 
                        <>
                        <Spinner size="sm"/>
                        <span className='ml-3 text-red-600'>Adding new parent...</span>
                        </>: "Add Parent"
                    }
                </Button>
                {
                    error && <Alert color="failure" className='text-black'>
                        {error.message}
                    </Alert>
                }
                {
                    addSuccess &&
                    <Alert className='mt-4' color="success">
                        New Parent Added Successfully!
                    </Alert>
                
                }
            </form>
            </div>
        </div>
    );
}
