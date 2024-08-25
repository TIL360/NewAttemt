import React from 'react'
import { FaBars, FaSearch } from 'react-icons/fa'

const Navbar = () => {
  return (
    <div className='bg-black px-4 py-3 flex justify-between ml-64'>
      <div className='flex items-center text-xl'>
      <FaBars className='text-white me-4 cursoe-pointer'/>
      <span className='text-white font-semibold'>E-Commerece</span>
      </div>
      <div className='flex items-center gap-x-5'>
        <div className='relative md:w-65'>
          <span className='relative md: absoloute inset-y-0 left-0 flex item-cener pl-2'><button><FaSearch /></button></span>
          <input type='text' />
        </div>

      </div>
    </div>
  )
}

export default Navbar
