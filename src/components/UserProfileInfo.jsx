import { Link } from 'react-router-dom'
import { BadgeCheck, CalendarDays, MapPin, MessageCircle, PenLine, UserPlus } from 'lucide-react'
import moment from 'moment'

const UserProfileInfo = ({ user, posts, isOwnProfile, isFollowing, isConnected, onEdit, onFollow }) => (
  <div className='relative bg-white px-5 pb-6 pt-5 sm:px-8'>
    <div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
      <div className='flex min-w-0 items-end gap-4'>
        <img src={user.profile_picture} alt='' className='-mt-14 size-24 shrink-0 rounded-3xl border-4 border-white bg-white object-cover shadow-md sm:-mt-16 sm:size-32' />
        <div className='min-w-0 pb-1'>
          <h1 className='flex flex-wrap items-center gap-2 text-2xl font-bold text-slate-900'>
            {user.full_name}
            {user.is_verified && <BadgeCheck size={19} className='text-blue-500' />}
          </h1>
          <p className='mt-0.5 text-sm text-slate-500'>@{user.username}</p>
        </div>
      </div>
      <div className='flex gap-2 sm:pb-1'>
        {isOwnProfile ? (
          <button type='button' onClick={onEdit} className='inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'>
            <PenLine size={16} /> Edit profile
          </button>
        ) : (
          <>
            <button type='button' onClick={onFollow} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isFollowing ? 'border border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
              <UserPlus size={16} /> {isFollowing ? 'Following' : 'Follow'}
            </button>
            {isConnected && <Link to={`/messages/${user._id}`} className='inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'><MessageCircle size={16} /> Message</Link>}
          </>
        )}
      </div>
    </div>
    {user.bio && <p className='mt-5 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-slate-600'>{user.bio}</p>}
    <div className='mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500'>
      {user.location && <span className='inline-flex items-center gap-1.5'><MapPin size={14} />{user.location}</span>}
      <span className='inline-flex items-center gap-1.5'><CalendarDays size={14} />Joined {moment(user.createdAt).format('MMMM YYYY')}</span>
    </div>
    <div className='mt-6 flex gap-6 border-t border-slate-100 pt-4'>
      <p className='text-sm text-slate-500'><span className='font-bold text-slate-900'>{posts.length}</span> posts</p>
      <p className='text-sm text-slate-500'><span className='font-bold text-slate-900'>{user.followers.length}</span> followers</p>
      <p className='text-sm text-slate-500'><span className='font-bold text-slate-900'>{user.following.length}</span> following</p>
    </div>
  </div>
)

export default UserProfileInfo
