import { createElement, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, MessageCircle, UserCheck, UserPlus, Users, X } from 'lucide-react'
import moment from 'moment'
import { useAppData } from '../context/useAppData'

const Connections = () => {
  const { currentUser, profiles, connectionRequests, respondToConnection, requestConnection, toggleFollow, removeConnection } = useAppData()
  const [activeTab, setActiveTab] = useState('Followers')
  const data = useMemo(() => {
    const incoming = connectionRequests.filter((request) => request.toUserId === currentUser._id && request.status === 'pending')
    const outgoing = connectionRequests.filter((request) => request.fromUserId === currentUser._id && request.status === 'pending')
    return {
      Followers: profiles.filter((profile) => profile.followers.includes(currentUser._id)),
      Following: profiles.filter((profile) => currentUser.following.includes(profile._id)),
      Requests: [...incoming.map((request) => ({ request, user: profiles.find((profile) => profile._id === request.fromUserId) })), ...outgoing.map((request) => ({ request, user: profiles.find((profile) => profile._id === request.toUserId) }))].filter((item) => item.user),
      Connections: profiles.filter((profile) => currentUser.connections.includes(profile._id)),
    }
  }, [connectionRequests, currentUser, profiles])
  const tabs = [
    { name: 'Followers', icon: Users },
    { name: 'Following', icon: UserCheck },
    { name: 'Requests', icon: UserPlus },
    { name: 'Connections', icon: Users },
  ]

  return (
    <div className='mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10'>
      <div className='mb-7'>
        <p className='text-sm font-semibold text-indigo-600'>Your network</p>
        <h1 className='mt-1 text-3xl font-bold tracking-tight text-slate-900'>Connections</h1>
        <p className='mt-2 text-slate-500'>Keep up with the people who make your community.</p>
      </div>
      <div className='mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {tabs.map(({ name, icon }) => (
          <div key={name} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center justify-between'>
              <span className='grid size-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600'>{createElement(icon, { size: 18 })}</span>
              <span className='text-2xl font-bold text-slate-900'>{data[name].length}</span>
            </div>
            <p className='mt-3 text-sm font-medium text-slate-500'>{name}</p>
          </div>
        ))}
      </div>
      <div className='mb-5 flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-200/70 p-1 sm:w-fit'>
        {tabs.map(({ name }) => (
          <button type='button' key={name} onClick={() => setActiveTab(name)} aria-pressed={activeTab === name} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === name ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            {name}
          </button>
        ))}
      </div>
      {data[activeTab].length > 0 ? (
        <div className='space-y-3'>
          {data[activeTab].map((item) => {
            const isRequest = activeTab === 'Requests'
            const user = isRequest ? item.user : item
            const request = isRequest ? item.request : null
            const isIncoming = request?.toUserId === currentUser._id
            return (
              <article key={isRequest ? request._id : user._id} className='flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5'>
                <Link to={`/profile/${user._id}`}>
                  <img src={user.profile_picture} alt='' className='size-14 rounded-full object-cover' />
                </Link>
                <div className='min-w-0 flex-1'>
                  <Link to={`/profile/${user._id}`} className='font-semibold text-slate-900 hover:text-indigo-600'>{user.full_name}</Link>
                  <p className='text-sm text-slate-500'>@{user.username}</p>
                  <p className='mt-1 line-clamp-1 text-sm text-slate-500'>{user.bio}</p>
                  {request && <p className='mt-1 text-xs text-slate-400'>{isIncoming ? 'Sent you a connection request' : `Request sent ${moment(request.createdAt).fromNow()}`}</p>}
                </div>
                <div className='flex w-full gap-2 sm:w-auto'>
                  {activeTab === 'Following' && (
                    <button type='button' onClick={() => toggleFollow(user._id)} className='flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none'>Unfollow</button>
                  )}
                  {activeTab === 'Requests' && isIncoming && (
                    <>
                      <button type='button' onClick={() => respondToConnection(request._id, false)} className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50' aria-label='Decline request'><X size={17} /></button>
                      <button type='button' onClick={() => respondToConnection(request._id, true)} className='flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 sm:flex-none'><Check size={16} className='mr-1 inline' />Accept</button>
                    </>
                  )}
                  {activeTab === 'Requests' && !isIncoming && (
                    <button type='button' onClick={() => requestConnection(user._id)} className='flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none'>Cancel request</button>
                  )}
                  {activeTab === 'Connections' && (
                    <>
                      <Link to={`/messages/${user._id}`} className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 sm:flex-none'><MessageCircle size={16} />Message</Link>
                      <button type='button' onClick={() => removeConnection(user._id)} className='rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600' aria-label={`Remove ${user.full_name} from connections`}><X size={17} /></button>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center'>
          <div className='mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600'><Users size={22} /></div>
          <h2 className='mt-4 font-semibold text-slate-900'>No {activeTab.toLowerCase()} yet</h2>
          <p className='mt-1 text-sm text-slate-500'>{activeTab === 'Requests' ? 'Connection requests will show up here.' : 'Find people to follow and grow your community.'}</p>
          <Link to='/discover' className='mt-4 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700'>Discover people</Link>
        </div>
      )}
    </div>
  )
}

export default Connections
