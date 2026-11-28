import { useNavigate } from 'react-router-dom'
import { Check, MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import { useAppData } from '../context/useAppData'

const UserCard = ({ user }) => {
  const navigate = useNavigate()
  const { currentUser, connectionRequests, requestConnection, toggleFollow } = useAppData()
  const isFollowing = currentUser.following.includes(user._id)
  const isConnected = currentUser.connections.includes(user._id)
  const requestSent = connectionRequests.some((request) =>
    request.fromUserId === currentUser._id
    && request.toUserId === user._id
    && request.status === 'pending'
  )

  return (
    <article className='flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
      <button type='button' onClick={() => navigate(`/profile/${user._id}`)} className='flex flex-col items-center text-center'>
        <img src={user.profile_picture} alt='' className='size-20 rounded-full object-cover ring-4 ring-indigo-50' />
        <span className='mt-4 font-semibold text-slate-900'>{user.full_name}</span>
        <span className='mt-0.5 text-sm text-slate-500'>@{user.username}</span>
      </button>
      <p className='mt-3 min-h-10 text-center text-sm leading-5 text-slate-600'>{user.bio || 'A new member of the community.'}</p>
      {user.location && (
        <p className='mt-3 flex items-center justify-center gap-1 text-xs text-slate-500'>
          <MapPin size={14} /> {user.location}
        </p>
      )}
      <p className='mt-2 text-center text-xs text-slate-400'>{user.followers.length} followers</p>
      <div className='mt-auto flex gap-2 pt-5'>
        <button type='button' onClick={() => toggleFollow(user._id)} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isFollowing ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {isFollowing ? <Check size={16} /> : <UserPlus size={16} />}
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button type='button' onClick={() => isConnected ? navigate(`/messages/${user._id}`) : requestConnection(user._id)} className='grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700' aria-label={isConnected ? `Message ${user.full_name}` : requestSent ? 'Cancel connection request' : `Connect with ${user.full_name}`} title={isConnected ? 'Open conversation' : requestSent ? 'Cancel request' : 'Send connection request'}>
          {isConnected ? <MessageCircle size={18} /> : requestSent ? <Check size={18} /> : <Plus size={19} />}
        </button>
      </div>
    </article>
  )
}

export default UserCard
