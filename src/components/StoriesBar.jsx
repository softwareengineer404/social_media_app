import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'
import { useAppData } from '../context/useAppData'
const StoriesBar = () => {
    const { stories, currentUser, deleteStory } = useAppData()
    const [showModal, setShowModal] = useState(false)
    const [viewingUserId, setViewingUserId] = useState(null)
    const storyGroups = useMemo(() => {
        const groups = new Map()
        stories
            .filter((story) => Date.now() - new Date(story.createdAt).getTime() < 24 * 60 * 60 * 1000)
            .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
            .forEach((story) => {
                if (!groups.has(story.user._id)) groups.set(story.user._id, [])
                groups.get(story.user._id).push(story)
            })
        return [...groups.entries()]
    }, [stories])
    const activeStories = storyGroups.find(([userId]) => userId === viewingUserId)?.[1] || []
  return (
    <section className='mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='font-semibold text-slate-900'>Stories</h2>
          <p className='text-xs text-slate-500'>Moments disappear after 24 hours</p>
        </div>
        <button type='button' onClick={() => setShowModal(true)} className='inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50'>
          <Plus size={17} /> Add story
        </button>
      </div>
      <div className='no-scrollbar flex gap-4 overflow-x-auto pb-1'>
        <button type='button' onClick={() => setShowModal(true)} className='flex w-20 shrink-0 flex-col items-center gap-2 text-center'>
          <span className='grid size-16 place-items-center rounded-full border-2 border-dashed border-indigo-300 bg-indigo-50 text-indigo-600'>
            <Plus size={24} />
          </span>
          <span className='text-xs font-medium text-slate-700'>Your story</span>
        </button>
        {storyGroups.map(([userId, userStories]) => {
          const user = userStories[0].user
          const isOwnStory = userId === currentUser._id
          return (
            <button type='button' key={userId} onClick={() => setViewingUserId(userId)} className='flex w-20 shrink-0 flex-col items-center gap-2 text-center'>
              <span className='rounded-full bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-400 p-[2px]'>
                <img src={user.profile_picture} alt='' className='size-16 rounded-full border-2 border-white object-cover' />
              </span>
              <span className='w-full truncate text-xs font-medium text-slate-700'>{isOwnStory ? 'Your story' : user.full_name}</span>
              <span className='sr-only'>{userStories.length} stories, latest {moment(userStories[0].createdAt).fromNow()}</span>
            </button>
          )
        })}
      </div>
      {showModal && <StoryModal setShowModal={setShowModal} />}
      {activeStories.length > 0 && (
        <StoryViewer
          key={viewingUserId}
          stories={activeStories}
          currentUserId={currentUser._id}
          onClose={() => setViewingUserId(null)}
          onDelete={deleteStory}
        />
      )}
    </section>
  )
}
export default StoriesBar