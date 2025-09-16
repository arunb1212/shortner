import React from 'react'

const Errors = ({message}) => {
  return (
    <div className='text-red-400 text-sm'>
    {
        message
    }
    
    </div>
  )
}

export default Errors