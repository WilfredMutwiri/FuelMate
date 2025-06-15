import React, { useEffect } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import {useState} from 'react';
import {SERVER_URL} from '../constants/SERVER_URL'
import { useDispatch } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../../Redux/User/userSlice';
import loginImg from '../assets/login.webp'
export default function SignIn(){
        const Navigate=useNavigate();
        const [loading,setIsLoading]=useState(false);
        const [formData,setFormData]=useState({});
        const [errorMessage,setErrorMessage]=useState("");
        const [loginSuccess,setLoginSuccess]=useState(false);
        const [showPassword,setShowPassowrd]=useState(false);
        const [welcomeText,setWelcomeText]=useState("Welcome Back!")
        const dispatch = useDispatch();
        useEffect(()=>{
            const getTimeOfDay=()=>{
                const hours=new Date().getHours();
                if(hours<12){
                    return 'Good Morning, Welcome Back Admin!'
                }else if (hours<18){
                    return 'Good Afternoon, Welcome Back Admin!'
                }else{
                    return 'Good Evening, Welcome Back Admin!'
                }
            };
            setWelcomeText(getTimeOfDay())
        },[])
        const handleChange=(e)=>{
            setFormData({...formData,[e.target.id]:e.target.value.trim()})
        }
        const handleSubmit=async(e)=>{
            e.preventDefault();
            setIsLoading(true);
            setErrorMessage("");
            setLoginSuccess(false)
            if(
                !formData.email ||
                !formData.password ||
                formData.email===" "||
                formData.password===""
            ){
                setErrorMessage("All fields must be filled!");
                setIsLoading(false);
                return;
            }
            try {
                dispatch(signInStart())
                const res=await fetch(SERVER_URL+'/api/auth/signin',{
                    method:"POST",
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(formData)
                })
                const data=await res.json();
                if(!res.ok){
                    setErrorMessage(data.message || "An error occurred")
                    dispatch(signInFailure(data.message || "An error occured"))
                    setIsLoading(false);
                    return;
                }
                dispatch(signInSuccess(data))
                setLoginSuccess(true)
                setLoginSuccess("Login successfull!")
                Navigate('/admin');
            } catch (error) {
                setErrorMessage(error.message)
                dispatch(signInFailure(error.message))
                setIsLoading(false)
            }
    
        }
  return (
        <div className="w-full">
            <hr/>
            <div className="block md:flex w-10/12 pt-10 md:pt-20 m-auto gap-5">
             <div className='flex-1'>
              <img src={loginImg} alt='login image'/>
            </div>
                <div className='flex-1 flex-col mt-5'>
                <h2 className='text-cyan-800 font-semibold text-lg md:text-xl'>{welcomeText}</h2>
                    <form className='flex flex-col gap-3 pt-2' onSubmit={handleSubmit}>
                        <Label value='Email address'/>
                        <TextInput
                        placeholder='admin@fuelmate.com'
                        type='email'
                        id='email'
                        onChange={handleChange}
                        required
                        />
                        <Label value='Password'/>
                        <TextInput 
                        placeholder='*******' 
                        type={showPassword ? 'text': 'password'}
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
                        <Button  gradientDuoTone='purpleToBlue'className='w-full' type='submit' disabled={loading}>
                            {
                                loading ? (
                                    <>
                                    <Spinner size="sm"/>
                                    <span className='pl-3'>Loading...</span>
                                    </>
                                ):'Login'
                            }
                        </Button>
                    </form>
                    {
                        errorMessage && <Alert color="failure" className='mt-4'>
                            {errorMessage}
                        </Alert>
                    }
                    {
                        loginSuccess && <Alert color="success" className='mt-4'>
                            {loginSuccess}
                        </Alert>
                    }
                    <p className='pt-3 text-sm'>
                        Don't have an account? <span className='text-blue-600'><a href='/Signup'>Create Account</a></span>
                    </p>
                </div>
            </div>
        </div>
    );
}
