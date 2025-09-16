import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loginform from '@/Components/ui/loginform'
const Login = () => {

    const [searchparams]=useSearchParams()

  return (
    <div className='flex flex-col justify-center items-center gap-[30px]'>
        {/* <h1>Login/signUp</h1> */}
        <div className='mt-[30px] text-center text-5xl font-bold'>
        {
            searchparams.get("createUrl")?"Hold up You need to Login First!!!":"Signup/login"
        }

        </div>
        <Tabs defaultValue="account" className="w-[400px]">
  <TabsList className="w-full grid grid-cols-2">
    <TabsTrigger value="Login">Login</TabsTrigger>
    <TabsTrigger value="SignUp">SignUp</TabsTrigger>
  </TabsList>
  <TabsContent value="Login" className="flex flex-col">
<Loginform/>
  </TabsContent>
  <TabsContent value="SignUp">Change your password here.</TabsContent>
</Tabs>

    </div>
  )
}

export default Login