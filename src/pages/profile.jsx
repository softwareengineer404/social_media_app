import { createElement, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid2X2, Heart, Image as ImageIcon, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import PostCard from '../components/PostCard'
import ProfileModal from '../components/ProfileModal'
import UserProfileInfo from '../components/UserProfileInfo'
import { useAppData } from '../context/useAppData'

const Profile = () => {
  const { profileId } = useParams()
  const { currentUser, profiles, posts, updateProfile, resetLocalData, toggleFollow } = useAppData()
  const [activeTab, setActiveTab] = useState('Posts')
  const [showEdit, setShowEdit] = useState(false)
  const isOwnProfile = !profileId || profileId === currentUser._id
  const user = isOwnProfile ? currentUser : profiles.find((profile) => profile._id === profileId)
  const userPosts = posts.filter((post) => post.user._id === user?._id)
  const likedPosts = posts.filter((post) => (post.likes_count || []).includes(user?._id))
  const mediaPosts = userPosts.filter((post) => post.image_urls?.length > 0)
  const isFollowing = currentUser.following.includes(user?._id)
  const isConnected = currentUser.connections.includes(user?._id)

  if (!user) {
    return (
      <div className='mx-auto max-w-xl px-5 py-20 text-center'>
        <h1 className='text-xl font-bold text-slate-900'>Profile not found</h1>
        <p className='mt-2 text-sm text-slate-500'>This profile is not available in your local community.</p>
      </div>
    )
  }

  const resetDemo = () => {
    if (!window.confirm('Reset your local demo data? This removes local posts, messages, profile edits, and connections from this browser.')) return
    resetLocalData()
    setActiveTab('Posts')
    toast.success('Local demo data has been reset.')
  }

  const tabs = [
    { label: 'Posts', icon: Grid2X2, count: userPosts.length },
    { label: 'Media', icon: ImageIcon, count: mediaPosts.length },
    { label: 'Likes', icon: Heart, count: likedPosts.length },
  ]
  const visiblePosts = activeTab === 'Likes' ? likedPosts : userPosts

  return (
    <div className='mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-9'>
      <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
        <div className='relative h-36 bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 sm:h-56'>
          {user.cover_photo && <img src={user.cover_photo} alt='' className='size-full object-cover' />}
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent' />
        </div>
        <UserProfileInfo
          user={user}
          posts={userPosts}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          isConnected={isConnected}
          onEdit={() => setShowEdit(true)}
          onFollow={() => toggleFollow(user._id)}
        />
      </div>
      <div className='mt-6 flex items-center justify-between'>
        <div className='flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-200/70 p-1'>
          {tabs.map(({ label, icon, count }) => (
            <button type='button' key={label} onClick={() => setActiveTab(label)} aria-pressed={activeTab === label} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === label ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {createElement(icon, { size: 16 })}{label}<span className='text-xs opacity-70'>{count}</span>
            </button>
          ))}
        </div>
        {isOwnProfile && (
          <button type='button' onClick={resetDemo} className='hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:inline-flex'>
            <RotateCcw size={14} /> Reset local demo
          </button>
        )}
      </div>
      {activeTab === 'Media' ? (
        mediaPosts.length > 0 ? (
          <div className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4'>
            {mediaPosts.flatMap((post) => post.image_urls.map((image, index) => (
              <a href={image} target='_blank' rel='noreferrer' key={`${post._id}-${index}`} className='group relative aspect-square overflow-hidden rounded-2xl bg-slate-100'>
                <img src={image} alt='Shared media' className='size-full object-cover transition duration-300 group-hover:scale-105' />
                <span className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 text-xs text-white opacity-0 transition group-hover:opacity-100'>{post.content || 'Photo'}</span>
              </a>
            )))}
          </div>
        ) : (
          <div className='mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500'>No media shared yet.</div>
        )
      ) : visiblePosts.length > 0 ? (
        <div className='mx-auto mt-5 flex max-w-2xl flex-col gap-5'>
          {visiblePosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      ) : (
        <div className='mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center'>
          <h2 className='font-semibold text-slate-900'>{activeTab === 'Likes' ? 'No liked posts yet' : 'No posts yet'}</h2>
          <p className='mt-1 text-sm text-slate-500'>{isOwnProfile ? 'Share a thought or a photo to get started.' : 'There is nothing here just yet.'}</p>
        </div>
      )}
      {isOwnProfile && (
        <p className='mt-8 text-center text-xs text-slate-400'>Your profile and activity are stored in this browser only.</p>
      )}
      {showEdit && <ProfileModal user={user} onClose={() => setShowEdit(false)} onSave={updateProfile} />}
    </div>
  )
}

export default Profile
