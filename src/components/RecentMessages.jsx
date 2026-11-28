import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import moment from 'moment'
import { useAppData } from '../context/useAppData'

const RecentMessages = () => {
  const { currentUser, messages, profiles } = useAppData()
  const conversations = [...new Set(messages.flatMap((message) => [
    message.from_user_id,
    message.to_user_id,
  ]).filter((userId) => userId !== currentUser._id))]
    .map((userId) => {
      const user = profiles.find((profile) => profile._id === userId)
      const latest = messages
        .filter((message) => message.from_user_id === userId || message.to_user_id === userId)
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))[0]
      return user ? { user, latest } : null
    })
    .filter(Boolean)
    .slice(0, 4)

  return (
    <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='font-semibold text-slate-900'>Recent messages</h2>
        <Link to='/messages' className='text-xs font-semibold text-indigo-600 hover:text-indigo-700'>See all</Link>
      </div>
      {conversations.length > 0 ? (
        <div className='divide-y divide-slate-100'>
          {conversations.map(({ user, latest }) => (
            <Link key={user._id} to={`/messages/${user._id}`} className='flex items-center gap-3 py-3 first:pt-1 last:pb-0 hover:opacity-80'>
              <img src={user.profile_picture} alt='' className='size-9 rounded-full object-cover' />
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-sm font-medium text-slate-800'>{user.full_name}</span>
                <span className='block truncate text-xs text-slate-500'>{latest.text || 'Photo'}</span>
              </span>
              <span className='text-[10px] text-slate-400'>{moment(latest.createdAt).fromNow()}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className='rounded-xl bg-slate-50 px-4 py-5 text-center'>
          <MessageCircle size={20} className='mx-auto text-slate-400' />
          <p className='mt-2 text-sm font-medium text-slate-700'>No conversations yet</p>
          <Link to='/messages' className='mt-1 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700'>Start a conversation</Link>
        </div>
      )}
    </section>
  )
}

export default RecentMessages
