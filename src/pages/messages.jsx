import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Search } from 'lucide-react'
import moment from 'moment'
import { useAppData } from '../context/useAppData'

const Messages = () => {
  const { currentUser, messages, profiles } = useAppData()
  const [query, setQuery] = useState('')
  const conversations = useMemo(() => {
    const peers = [...new Set(messages.flatMap((message) => [
      message.from_user_id,
      message.to_user_id,
    ]).filter((userId) => userId !== currentUser._id))]
    return peers.map((userId) => {
      const user = profiles.find((profile) => profile._id === userId)
      const thread = messages
        .filter((message) => message.from_user_id === userId || message.to_user_id === userId)
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
      return user ? { user, latest: thread[0], unread: thread.filter((message) => message.from_user_id === userId && message.to_user_id === currentUser._id && !message.seen).length } : null
    }).filter(Boolean).sort((first, second) => new Date(second.latest.createdAt) - new Date(first.latest.createdAt))
  }, [currentUser._id, messages, profiles])
  const filteredProfiles = profiles.filter((profile) =>
    profile._id !== currentUser._id
    && profile.full_name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className='mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10'>
      <div className='mb-7'>
        <p className='text-sm font-semibold text-indigo-600'>Your inbox</p>
        <h1 className='mt-1 text-3xl font-bold tracking-tight text-slate-900'>Messages</h1>
        <p className='mt-2 text-slate-500'>Pick up a conversation or say hello to someone new.</p>
      </div>
      <div className='mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm'>
        <Search size={18} className='text-slate-400' />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Find a person...' className='w-full bg-transparent text-sm outline-none placeholder:text-slate-400' aria-label='Find a person to message' />
      </div>
      {conversations.length > 0 && (
        <section className='mb-8'>
          <h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500'>Recent conversations</h2>
          <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
            {conversations.map(({ user, latest, unread }) => (
              <Link key={user._id} to={`/messages/${user._id}`} className='flex items-center gap-4 border-b border-slate-100 p-4 last:border-0 hover:bg-slate-50'>
                <img src={user.profile_picture} alt='' className='size-12 rounded-full object-cover' />
                <span className='min-w-0 flex-1'>
                  <span className='block font-semibold text-slate-900'>{user.full_name}</span>
                  <span className='mt-0.5 block truncate text-sm text-slate-500'>{latest.text || 'Photo'}</span>
                </span>
                <span className='text-xs text-slate-400'>{moment(latest.createdAt).fromNow()}</span>
                {unread > 0 && <span className='grid size-5 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white'>{unread}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 className='mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500'>People</h2>
        {filteredProfiles.length > 0 ? (
          <div className='grid gap-3 sm:grid-cols-2'>
            {filteredProfiles.map((profile) => (
              <div key={profile._id} className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                <img src={profile.profile_picture} alt='' className='size-11 rounded-full object-cover' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-semibold text-slate-900'>{profile.full_name}</p>
                  <p className='truncate text-sm text-slate-500'>@{profile.username}</p>
                </div>
                <Link to={`/messages/${profile._id}`} className='inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100'>
                  <MessageCircle size={16} /><span className='hidden sm:inline'>Message</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center'>
            <p className='font-semibold text-slate-800'>No people match “{query}”</p>
            <p className='mt-1 text-sm text-slate-500'>Try another name or search term.</p>
          </div>
        )}
      </section>
    </div>
  )
}
export default Messages
