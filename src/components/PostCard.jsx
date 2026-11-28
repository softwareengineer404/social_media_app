import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bookmark,
  BadgeCheck,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
} from 'lucide-react'
import moment from 'moment'
import toast from 'react-hot-toast'
import { useAppData } from '../context/useAppData'

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const {
    addComment,
    currentUser,
    deletePost,
    toggleBookmark,
    toggleLike,
    bookmarks,
  } = useAppData()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const liked = (post.likes_count || []).includes(currentUser._id)
  const saved = bookmarks.includes(post._id)
  const comments = post.comments || []

  const submitComment = (event) => {
    event.preventDefault()
    if (!commentText.trim()) return
    addComment(post._id, commentText)
    setCommentText('')
  }

  const sharePost = async () => {
    const url = `${window.location.origin}/profile/${post.user._id}`
    try {
      if (navigator.share) await navigator.share({ title: `${post.user.full_name}'s post`, url })
      else {
        await navigator.clipboard.writeText(url)
        toast.success('Post link copied.')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Unable to share post:', error)
        toast.error('The share link could not be copied.')
      }
    }
  }

  const contentParts = (post.content || '').split(/(#\w+)/g)
  return (
    <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md'>
      <header className='flex items-center justify-between p-4 sm:px-5 sm:pt-5'>
        <button type='button' onClick={() => navigate(`/profile/${post.user._id}`)} className='flex min-w-0 items-center gap-3 text-left'>
          <img src={post.user.profile_picture} alt='' className='size-11 shrink-0 rounded-full object-cover ring-2 ring-indigo-50' />
          <span className='min-w-0'>
            <span className='flex items-center gap-1 truncate text-sm font-semibold text-slate-900'>
              {post.user.full_name}
              {post.user.is_verified && <BadgeCheck size={15} className='shrink-0 text-blue-500' />}
            </span>
            <span className='block truncate text-xs text-slate-500'>@{post.user.username} · {moment(post.createdAt).fromNow()}</span>
          </span>
        </button>
        <div className='relative'>
          <button type='button' onClick={() => setMenuOpen((open) => !open)} className='rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700' aria-label='Post options'>
            <MoreHorizontal size={20} />
          </button>
          {menuOpen && (
            <div className='absolute right-0 top-10 z-10 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl'>
              {post.user._id === currentUser._id && (
                <button type='button' onClick={() => { deletePost(post._id); setMenuOpen(false) }} className='flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50'>
                  <Trash2 size={16} /> Delete post
                </button>
              )}
              <button type='button' onClick={() => { toggleBookmark(post._id); setMenuOpen(false); toast.success(saved ? 'Removed from saved posts.' : 'Post saved.') }} className='flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50'>
                <Bookmark size={16} /> {saved ? 'Unsave post' : 'Save post'}
              </button>
            </div>
          )}
        </div>
      </header>
      {post.content && (
        <div className='whitespace-pre-wrap px-4 pb-4 text-[15px] leading-6 text-slate-700 sm:px-5'>
          {contentParts.map((part, index) => part.startsWith('#')
            ? <span key={index} className='font-medium text-indigo-600'>{part}</span>
            : part
          )}
        </div>
      )}
      {post.image_urls?.length > 0 && (
        <div className={`grid gap-1.5 overflow-hidden ${post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.image_urls.slice(0, 4).map((image, index) => (
            <img key={`${post._id}-${index}`} src={image} alt={`Post attachment ${index + 1}`} className={`max-h-[560px] w-full bg-slate-100 object-cover ${post.image_urls.length === 1 ? '' : 'aspect-square'}`} />
          ))}
        </div>
      )}
      <div className='flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500 sm:px-5'>
        <div className='flex items-center gap-5'>
          <button type='button' onClick={() => toggleLike(post._id)} className={`inline-flex items-center gap-1.5 transition hover:text-rose-600 ${liked ? 'font-semibold text-rose-600' : ''}`} aria-pressed={liked}>
            <Heart size={19} className={liked ? 'fill-rose-500' : ''} /> {(post.likes_count || []).length}
          </button>
          <button type='button' onClick={() => setCommentsOpen((open) => !open)} className='inline-flex items-center gap-1.5 transition hover:text-indigo-600' aria-expanded={commentsOpen}>
            <MessageCircle size={19} /> {comments.length}
          </button>
          <button type='button' onClick={sharePost} className='inline-flex items-center gap-1.5 transition hover:text-indigo-600'>
            <Send size={17} /> <span className='hidden sm:inline'>Share</span>
          </button>
        </div>
        <button type='button' onClick={() => { toggleBookmark(post._id); toast.success(saved ? 'Removed from saved posts.' : 'Post saved.') }} className={`rounded-lg p-2 transition hover:bg-slate-100 ${saved ? 'text-indigo-600' : 'text-slate-400'}`} aria-label={saved ? 'Unsave post' : 'Save post'} aria-pressed={saved}>
          <Bookmark size={18} className={saved ? 'fill-indigo-100' : ''} />
        </button>
      </div>
      {commentsOpen && (
        <section className='border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5'>
          <div className='mb-3 max-h-56 space-y-3 overflow-y-auto'>
            {comments.map((comment) => (
              <div key={comment._id} className='flex gap-2.5'>
                <img src={comment.user.profile_picture} alt='' className='size-8 rounded-full object-cover' />
                <div className='min-w-0 rounded-2xl bg-white px-3 py-2'>
                  <p className='text-xs font-semibold text-slate-800'>{comment.user.full_name}</p>
                  <p className='whitespace-pre-wrap break-words text-sm text-slate-600'>{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className='text-sm text-slate-500'>Be the first to comment.</p>}
          </div>
          <form onSubmit={submitComment} className='flex items-center gap-2'>
            <img src={currentUser.profile_picture} alt='' className='size-8 rounded-full object-cover' />
            <input value={commentText} onChange={(event) => setCommentText(event.target.value)} maxLength={500} placeholder='Write a comment...' className='min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100' />
            <button type='submit' disabled={!commentText.trim()} className='rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40'>Post</button>
          </form>
        </section>
      )}
    </article>
  )
}

export default PostCard
