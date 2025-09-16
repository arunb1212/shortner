import React, { useState } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from './button'
import { BeatLoader } from 'react-spinners'
const Loginform = () => {

    const[formData,setFormData]=useState({
        Email:"",
        Password:"",
    })

    const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData((prevState)=>({
        ...prevState,
        [name]:value
    }))
    }

console.log(formData)
  return (
    <Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>Login If you have one</CardDescription>
    {/* <CardAction>Card Action</CardAction> */}
  </CardHeader>
  <CardContent className="w-full">
    <input className='w-full outline-none border h-[30px] rounded-[5px] px-[10px] border-white ' type="email" name='Email' onChange={handleChange} placeholder='Enter Your email Id' required />
  </CardContent>
  <CardContent className="w-full">
    <input className='w-full outline-none border h-[30px] rounded-[5px] px-[10px] border-white ' type="password" name='password' onChange={handleChange} placeholder='Enter Your Password' required />
  </CardContent>
  <CardFooter>
    <Button>{true?<BeatLoader size={10} color="#00000"/>:"Login"}</Button>
  </CardFooter>
</Card>
  )
}

export default Loginform