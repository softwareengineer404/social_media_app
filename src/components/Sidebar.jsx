import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react' //Purpose: Imports the plus-circle icon from the icon library
import { Link, useNavigate } from 'react-router-dom' //Imports navigation tools for moving between pages.
import { UserButton, useClerk, useUser } from '@clerk/clerk-react' //Imports Clerk authentication components and functions
const Sidebar = ({sidebarOpen, setSidebarOpen}) => {
    const navigate = useNavigate()
    const { user: clerkUser } = useUser()
    const user = dummyUserData //Stores user profile fallback data.
    const { signOut } = useClerk() //Gets logout function from Clerk.

    const displayName = clerkUser?.fullName || user.full_name
    const displayUsername = clerkUser?.username || user.username || user.user_name

    const handleSignOut = async () => {
      try {
        await signOut({ redirectUrl: '/login' })
      } catch {
        navigate('/login')
      }
    }

  return (
    <div className={`w-60 xl:w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col
    justify-between items-center max-sm:fixed max-sm:inset-y-0 max-sm:left-0 z-40
    ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all
    duration-300 ease-in-out`}>
      <div className='w-full'>
        <img
          onClick={() => {
            navigate('/')
            setSidebarOpen(false)
          }}
          src={assets.logo}
          className='w-28 ml-7 my-3 cursor-pointer'
          alt="pingup"
        />
        <hr className='border-gray-200 mb-6'/>
        <MenuItems setSidebarOpen={setSidebarOpen}/>
        <Link
          to='/create-post'
          onClick={() => setSidebarOpen(false)}
          className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'
        >
          <CirclePlus className='w-5 h-5'/>
          Create Post
        </Link>
      </div>
        <div className='w-full border-t border-gray-200 p-4 px-6 flex items-center
        justify-between gap-2'>
          <div className='flex gap-2.5 items-center min-w-0'>
            <UserButton />
            <div className='min-w-0'>
              <h1 className='text-sm font-medium truncate'>{displayName}</h1>
              <p className='text-xs text-gray-500 truncate'>@{displayUsername}</p>
            </div>
          </div>
          <button
            type='button'
            onClick={handleSignOut}
            aria-label='Sign out'
            title='Sign out'
            className='p-1.5 text-gray-400 hover:text-gray-700 transition cursor-pointer shrink-0'
          >
            <LogOut className='w-4.5 h-4.5'/>
          </button>
        </div>
    </div>
  )
}
export default Sidebar