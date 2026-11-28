import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
const MenuItems = ({ setSidebarOpen }) => {
  return (
    <nav className='space-y-1 font-medium' aria-label='Main navigation'>
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          {React.createElement(Icon, { size: 19, strokeWidth: 1.8 })}
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
export default MenuItems