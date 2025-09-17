import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/Components/Header'
const App_layout = () => {
  return (
    <div >
      <div className='min-h-screen'>
      <Header/>
      <Outlet/>
      </div>

      <div className='text-center w-full p-[10px] bg-gray-600'>
        <h1>Made with love by @arun</h1>
      </div>
     
    </div>
  )
}

export default App_layout