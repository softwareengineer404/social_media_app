import { useMemo, useState } from 'react'
import { Search, Sparkles, Users } from 'lucide-react'
import UserCard from '../components/UserCard'
import { useAppData } from '../context/useAppData'

const Discover = () => {
  const { currentUser, profiles } = useAppData()
  const [query, setQuery] = useState('')
  const [showFollowing, setShowFollowing] = useState(false)
  const users = useMemo(() => profiles.filter((user) => {
    if (user._id === currentUser._id) return false
    if (showFollowing && !currentUser.following.includes(user._id)) return false
    const searchable = `${user.full_name} ${user.username} ${user.bio} ${user.location}`.toLowerCase()
    return searchable.includes(query.trim().toLowerCase())
  }), [currentUser._id, currentUser.following, profiles, query, showFollowing])

  return (
    <div className='mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10'>
      <div className='mb-7'>
        <p className='text-sm font-semibold text-indigo-600'>Find your people</p>
        <h1 className='mt-1 text-3xl font-bold tracking-tight text-slate-900'>Discover</h1>
        <p className='mt-2 text-slate-500'>Meet the people and perspectives that make this community.</p>
      </div>
      <div className='mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center'>
        <label className='relative min-w-0 flex-1'>
          <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Search people, interests, or places...' className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100' aria-label='Search community' />
        </label>
        <button type='button' onClick={() => setShowFollowing((following) => !following)} aria-pressed={showFollowing} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${showFollowing ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          <Users size={17} /> {showFollowing ? 'Following' : 'Everyone'}
        </button>
      </div>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='font-semibold text-slate-800'>{showFollowing ? 'People you follow' : 'Suggested for you'}</h2>
        <span className='text-sm text-slate-400'>{users.length} people</span>
      </div>
      {users.length > 0 ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {users.map((user) => <UserCard key={user._id} user={user} />)}
        </div>
      ) : (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center'>
          <div className='mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600'><Sparkles size={22} /></div>
          <h2 className='mt-4 font-semibold text-slate-900'>No people found</h2>
          <p className='mt-1 text-sm text-slate-500'>{showFollowing ? 'Follow someone to see them in this list.' : 'Try a different name, username, or location.'}</p>
        </div>
      )}
    </div>
  )
}
export default Discover
