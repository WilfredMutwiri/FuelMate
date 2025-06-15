import React from 'react'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import {SERVER_URL} from '../constants/SERVER_URL'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import signupImg from '../images/signup.webp'
export default function signup() {
  const [formData,setFormData]=useState({});
  const [loading,setLoading]=useState(false);
  const [errorMessage,setErrorMessage]=useState("");
  const [successMessage,setSuccessMessage]=useState(false);
  const [showPassword,setShowPassowrd]=useState(false)


  const Navigate=useNavigate();

  const handleChange=(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  const handleSubmit=async(e)=>{
      e.preventDefault();
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage(false)
      if(!formData.userName || !formData.email || !formData.password){
          return setErrorMessage("All fields must be filled")
      }
      try {
          const res=await fetch(SERVER_URL+'/api/auth/signup',{
              method:"POST",
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(formData)
          });
          const data=await res.json();
          if(!res.ok){
            setErrorMessage(data.message)
            setLoading(false)
            return;
          }
            setLoading(false)
            setSuccessMessage(true)
            setSuccessMessage("Account Created Successfully!");
            Navigate('/signIn')
      } catch (error) {
          setErrorMessage(error.message);
          setSuccessMessage(false);
          setLoading(false);
      }
  }
    return (
        <div className="w-full">
            <hr />
            <div className="block md:flex w-10/12 pt-10 md:pt-20 m-auto gap-6">
            <div className='flex-1'>
                <img src={signupImg} alt='signup image'/>
            </div>
                <div className='flex-1 mt-5 md:mt-0'>
                    <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
                        <Label value='Username'/>
                        <TextInput 
                        placeholder='mark'
                        type='text'
                        id='userName'
                        onChange={handleChange}
                        required
                        />
                        <Label value='Email address'/>
                        <TextInput 
                        placeholder='mark@gmail.com'
                        type='email'
                        id='email'
                        onChange={handleChange}
                        required
                        />
                        <Label value='Password'/>
                        <TextInput
                        placeholder='Usermark@2024'
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        onChange={handleChange}
                        required
                        />
                        <div className='flex gap-2 p-2'>
                            <input
                            type='checkbox'
                            id='showPasswordBox'
                            checked={showPassword}
                            onChange={()=>setShowPassowrd(!showPassword)}
                            />
                            <Label htmlFor='showPasswordBox'value='Show Password'/>
                        </div>
                        <Button 
                        gradientDuoTone='pinkToOrange'
                        type='submit'
                        disabled={loading}
                        >
                            {
                                loading?(
                                    <>
                                    <Spinner size="sm"/>
                                    <span className='pl-3'>Loading...</span>
                                    </>
                                ):'Create Account'
                            }
                        </Button>
                    </form>
                    <p className='pt-3 text-sm'>
                        Already have an account? <span className='text-blue-600'><a href='/Signin'>Login</a></span>
                    </p>
                    {
                    errorMessage &&
                    <Alert color="failure" className='mt-5'>
                        {errorMessage}
                    </Alert>
                }
                {
                    successMessage &&
                    <Alert color="success" className='mt-5'>
                        {successMessage}
                    </Alert>
                }
                </div>
            </div>
        </div>
    );
}