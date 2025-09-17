import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LogOut, User } from 'lucide-react'
const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  return (
    <div className='flex justify-between items-center w-full p-[10px]'>
        <div className='flex justify-between items-center w-full'>
            <Link to="/">
            <h1>Trimmr</h1>
            </Link>
            {
                user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {user.email}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                      
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleLogout}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 mr-2"/> 
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button onClick={() => navigate('/login')}>
                      Login
                    </Button>
                )
            }
            {/* <Button onClick={()=>navigate('/login')}>Login</Button> */}
           
        </div>
    </div>
  )
}

export default Header