import { useCallback, useEffect, useState } from 'react'
import { BadgeCheck, ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react'

const STORY_DURATION = 6000

const StoryViewer = ({ stories, currentUserId, onClose, onDelete }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const story = stories[activeIndex]
  const showNext = useCallback(() => {
    if (activeIndex === stories.length - 1) onClose()
    else setActiveIndex((index) => index + 1)
  }, [activeIndex, onClose, stories.length])
  const deleteCurrentStory = () => {
    onDelete(story._id)
    if (stories.length === 1) onClose()
    else setActiveIndex((index) => Math.max(0, index - 1))
  }

  useEffect(() => {
    if (!story || story.media_type === 'video') return undefined
    const timer = window.setTimeout(showNext, STORY_DURATION)
    return () => window.clearTimeout(timer)
  }, [activeIndex, onClose, showNext, story, stories.length])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') showNext()
      if (event.key === 'ArrowLeft') setActiveIndex((index) => Math.max(0, index - 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, onClose, showNext])

  if (!story) return null
  const isTextStory = story.media_type === 'text'

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-slate-950/95 p-3 sm:p-6' role='dialog' aria-modal='true' aria-label='Story viewer'>
      <div className='relative flex h-[min(88vh,780px)] w-full max-w-[440px] flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-2xl' style={{ backgroundColor: isTextStory ? story.background_color : '#0f172a' }}>
        <div className='absolute left-3 right-3 top-3 z-20 flex gap-1'>
          {stories.map((item, index) => (
            <span key={item._id} className='h-1 flex-1 overflow-hidden rounded-full bg-white/40'>
              <span
                key={`${item._id}-${index === activeIndex}`}
                className={`block h-full bg-white ${index < activeIndex ? 'w-full' : index === activeIndex && item.media_type !== 'video' ? 'animate-story-progress' : 'w-0'}`}
              />
            </span>
          ))}
        </div>
        <header className='absolute left-0 right-0 top-5 z-20 flex items-center justify-between p-4 pt-5'>
          <div className='flex min-w-0 items-center gap-3'>
            <img src={story.user?.profile_picture} alt='' className='size-10 rounded-full border-2 border-white/80 object-cover' />
            <div className='min-w-0 text-white'>
              <p className='flex items-center gap-1 truncate text-sm font-semibold'>
                {story.user?.full_name} <BadgeCheck size={15} className='shrink-0 text-sky-300' />
              </p>
              <p className='text-xs text-white/70'>{new Date(story.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {story.user?._id === currentUserId && (
              <button type='button' onClick={deleteCurrentStory} className='rounded-full bg-black/30 p-2 text-white hover:bg-rose-600' aria-label='Delete story'><Trash2 size={18} /></button>
            )}
            <button type='button' onClick={onClose} className='rounded-full bg-black/30 p-2 text-white hover:bg-black/50' aria-label='Close story viewer'>
              <X size={21} />
            </button>
          </div>
        </header>
        <div className='grid min-h-0 flex-1 place-items-center overflow-hidden'>
          {isTextStory && <p className='max-h-full overflow-y-auto whitespace-pre-wrap px-9 pt-16 text-center text-2xl font-semibold leading-relaxed text-white'>{story.content}</p>}
          {story.media_type === 'image' && <img src={story.media_url} alt='Story' className='max-h-full max-w-full object-contain' />}
          {story.media_type === 'video' && <video src={story.media_url} className='max-h-full max-w-full' controls autoPlay onEnded={showNext} />}
        </div>
        <button type='button' onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} disabled={activeIndex === 0} className='absolute bottom-1/2 left-2 z-10 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/60 disabled:opacity-20' aria-label='Previous story'>
          <ChevronLeft size={22} />
        </button>
        <button type='button' onClick={showNext} className='absolute bottom-1/2 right-2 z-10 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/60' aria-label='Next story'>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )
}
export default StoryViewer