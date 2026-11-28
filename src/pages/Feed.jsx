import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlus, PenLine, Sparkles } from 'lucide-react'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import { assets } from '../assets/assets'
import { useAppData } from '../context/useAppData'

const Feed = () => {
  const { currentUser, posts, bookmarks, profiles } = useAppData()
  const [filter, setFilter] = useState('For you')
  const visiblePosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      if (filter === 'Following') {
        return post.user._id === currentUser._id || currentUser.following.includes(post.user._id)
      }
      if (filter === 'Saved') return bookmarks.includes(post._id)
      return true
    })
    return filtered.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
  }, [bookmarks, currentUser._id, currentUser.following, filter, posts])

  return (
    <div className='mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-9'>
      <section className='min-w-0'>
        <div className='mb-6'>
          <p className='text-sm font-semibold text-indigo-600'>Good to see you, {currentUser.full_name.split(' ')[0]}</p>
          <h1 className='mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'>Your community, in one place.</h1>
          <p className='mt-1 text-sm text-slate-500'>Catch up on the latest from people you follow.</p>
        </div>
        <StoriesBar />
        <Link to='/create-post' className='mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md'>
          <img src={currentUser.profile_picture} alt='' className='size-10 rounded-full object-cover' />
          <span className='flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-500'>Share something with your community...</span>
          <span className='hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 sm:flex'>
            <ImagePlus size={17} /> Photo
          </span>
          <span className='grid size-9 place-items-center rounded-full bg-indigo-600 text-white sm:hidden' aria-hidden='true'><PenLine size={17} /></span>
        </Link>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex gap-1 rounded-xl bg-slate-200/70 p-1'>
            {['For you', 'Following', 'Saved'].map((tab) => (
              <button type='button' key={tab} onClick={() => setFilter(tab)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`} aria-pressed={filter === tab}>
                {tab}
              </button>
            ))}
          </div>
          <span className='text-xs text-slate-400'>{visiblePosts.length} posts</span>
        </div>
        <div className='space-y-5'>
          {visiblePosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {visiblePosts.length === 0 && (
          <div className='rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center'>
            <div className='mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600'><Sparkles size={22} /></div>
            <h2 className='mt-4 font-semibold text-slate-900'>{filter === 'Saved' ? 'No saved posts yet' : 'Your feed is all caught up'}</h2>
            <p className='mx-auto mt-1 max-w-sm text-sm text-slate-500'>{filter === 'Following' ? 'Follow people in Discover to see their posts here.' : filter === 'Saved' ? 'Save posts you want to come back to.' : 'Be the first to share something today.'}</p>
            {filter === 'Following' && <Link to='/discover' className='mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700'>Discover people</Link>}
            {filter === 'For you' && <Link to='/create-post' className='mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700'>Create a post</Link>}
          </div>
        )}
      </section>
      <aside className='hidden space-y-5 lg:block'>
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='p-4'>
            <p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Community pick</p>
            <h2 className='mt-1 font-semibold text-slate-900'>Make room for good ideas.</h2>
          </div>
          <img src={assets.sponsored_img} className='h-40 w-full object-cover' alt='Creative workspace' />
          <p className='p-4 text-sm leading-5 text-slate-500'>Explore thoughtful stories and conversations from across your community.</p>
        </div>
        <RecentMessages />
        <div className='px-2 text-xs leading-5 text-slate-400'>
          <p>{profiles.length} people in your local community</p>
          <p className='mt-1'>Your activity is saved in this browser.</p>
        </div>
      </aside>
    </div>
  )
}

export default Feed
