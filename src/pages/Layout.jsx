import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
const Layout = () => {
  const { isLoaded } = useUser()
  const user = dummyUserData
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return isLoaded && user ? (
    <div className='w-full flex h-screen overflow-hidden bg-slate-50'>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 z-30 bg-black/30 sm:hidden'
        />
      )}
      <div className='flex-1 min-w-0 h-full overflow-y-auto bg-slate-50'>
        <Outlet />
      </div>
      <button
        type='button'
        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setSidebarOpen((prev) => !prev)}
        className='fixed top-3 right-3 p-2 z-50 bg-white rounded-md shadow w-10 h-10 flex items-center justify-center text-gray-600 sm:hidden cursor-pointer'
      >
        {sidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
      </button>
    </div>
  ) : (
    <Loading />
  )
}

export default Layout