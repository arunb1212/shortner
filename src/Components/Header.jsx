import React, { use } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
// import { useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react'
const Header = () => {
const user=true
const navigate=useNavigate()
  return (
    <div className='flex justify-between items-center w-full p-[10px]'>
        <div className='flex justify-between items-center w-full'>
            <Link to="/">
            <h1>Trimmr</h1>
            </Link>
            {
                user ? (
                    <DropdownMenu>
  <DropdownMenuTrigger><Button>User</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Arun Bhagat</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Links</DropdownMenuItem>
    <DropdownMenuItem className="hover:text-red-600"><LogOut className="w-4 h-4"/> Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
                ) : (
                    <Button onClick={()=>navigate('/login')}>Login</Button>
                )
            }
            {/* <Button onClick={()=>navigate('/login')}>Login</Button> */}
           
        </div>
    </div>
  )
}

export default Header