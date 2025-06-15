import React, { useReducer } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from 'react';
import { addWorkerStart,addWorkerSuccess,addWorkerFailure } from '../../../Redux/User/workerSlice';
import { useDispatch,useSelector} from 'react-redux';
import { SERVER_URL } from '../../constants/SERVER_URL';
export default function WorkersUpdate() {
    const [isLoading,setIsLoading]=useState(false);
    const [formData,setFormData]=useState({});
    const [addSuccess,setAddSuccess]=useState(false);
    const [isError,setIsError]=useState(false);

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
        setAddSuccess(false);
        setIsError(false);
        try {
            dispatch(addWorkerStart());
            const res=await fetch(SERVER_URL+'/api/users/addWorker',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            });
            const data=await res.json();
            if(data.success===false){
                dispatch(addWorkerFailure(data.message));
                return;
            }
            if(res.ok){
                dispatch(addWorkerSuccess(data));
                setAddSuccess(true);
                setIsLoading(false);
                setIsError(false)
            }
            handleReload()
        } catch (error) {
            setIsLoading(false);
            setAddSuccess(false);
            setIsError(error.message)
            dispatch(addWorkerFailure(error.message))
        }
    }
    return (
        <div className="w-full">
            <Button onClick={handleReload} outline>Back</Button>
            <div className="w-full md:w-5/12 m-auto bg-cyan-700 mt-4 p-3 rounded-md">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <Label value="Full Name" id="fullName" className="text-white"/>
                <TextInput 
                placeholder="full name"
                type="text"
                id='fullName'
                required
                onChange={handleChange}
                />
                <Label value="email" id="email" className="text-white"/>
                <TextInput 
                placeholder="worker@gmail.com"
                type="email"
                id='email'
                required
                onChange={handleChange}
                />
                <Label value="phone number" id="phoneNo" className="text-white"/>
                <TextInput 
                placeholder="+254700000000"
                type="text"
                id='phoneNo'
                required
                onChange={handleChange}
                />
                <Label value='Department' id='Department' className='text-white'/>
                <TextInput
                placeholder="security"
                type='text'
                id='Department'
                required
                onChange={handleChange}/>

                <Button className="w-full mt-4" gradientDuoTone="pinkToOrange" outline type='submit' disabled={isLoading}>
                    {
                        isLoading ?
                        <>
                        <Spinner size="sm"/>
                        <span className='ml-3 text-red-600'>Adding New Worker...</span>
                        </>:'Add new Worker'
                    }
                </Button>
                {
                    addSuccess &&
                    <Alert className='mt-4' color="success">
                        New Worker Added Successfully!
                    </Alert>
                }
                {
                    isError &&
                    <Alert className='mt-4' color="failure">
                        {isError.message}
                    </Alert>
                }
            </form>
            </div>
        </div>
    );
  }