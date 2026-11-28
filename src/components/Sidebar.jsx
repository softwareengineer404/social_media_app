import { assets } from '../assets/assets'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton } from '@clerk/clerk-react'
import { useAppData } from '../context/useAppData'
const Sidebar = ({sidebarOpen, setSidebarOpen}) => {
    const navigate = useNavigate()
    const user = useAppData().currentUser
    const { signOut } = useClerk()
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col justify-between border-r border-slate-200 bg-white transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
      <div className='w-full'>
        <button type='button' onClick={() => { navigate('/'); setSidebarOpen(false) }} className='flex h-16 w-full items-center px-7'>
          <img src={assets.logo} className='h-9 w-auto' alt='PingUp home' />
        </button>
        <div className='px-4 pb-5 pt-4'>
          <MenuItems setSidebarOpen={setSidebarOpen} />
        </div>
        <Link onClick={() => setSidebarOpen(false)} to='/create-post' className='mx-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 active:scale-[.98]'>
          <CirclePlus className='w-5 h-5'/>
          Create Post
        </Link>
      </div>
      <div className='flex w-full items-center justify-between border-t border-slate-200 p-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <UserButton />
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-slate-800'>{user.full_name}</p>
            <p className='truncate text-xs text-slate-500'>@{user.username}</p>
          </div>
        </div>
        <button type='button' onClick={() => signOut()} className='rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600' aria-label='Sign out'>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}
export default Sidebar