import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, ShieldCheck, X } from 'lucide-react'
import { useAppData } from '../context/useAppData'
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser } = useAppData()
  return (
    <div className='min-h-screen bg-slate-50 md:flex'>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {sidebarOpen && (
        <button type='button' onClick={() => setSidebarOpen(false)} aria-label='Close navigation' className='fixed inset-0 z-30 bg-slate-950/30 md:hidden' />
      )}
      <div className='min-w-0 flex-1'>
        <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8'>
          <button
            type='button'
            onClick={() => setSidebarOpen((open) => !open)}
            className='rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden'
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          >
            {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <div className='hidden items-center gap-2 text-sm text-slate-500 sm:flex'>
            <ShieldCheck size={16} className='text-emerald-600' />
            <span>Saved on this device</span>
          </div>
          <div className='ml-auto flex items-center gap-3'>
            <div className='text-right'>
              <p className='text-sm font-semibold text-slate-800'>{currentUser.full_name}</p>
              <p className='text-xs text-slate-500'>@{currentUser.username}</p>
            </div>
            <img src={currentUser.profile_picture} alt='' className='size-9 rounded-full object-cover ring-2 ring-indigo-100' />
          </div>
        </header>
        <main className='min-h-[calc(100vh-4rem)]'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default Layout