import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, LoaderCircle, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppData } from '../context/useAppData'
import { fileToLocalUrl } from '../data/media'

const MAX_IMAGES = 4
const MAX_POST_LENGTH = 2000

const CreatePost = () => {
  const { currentUser, createPost } = useAppData()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [isPublishing, setIsPublishing] = useState(false)
  const navigate = useNavigate()

  const addImages = async (event) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`You can add up to ${MAX_IMAGES} images.`)
      return
    }

    try {
      const localImages = await Promise.all(files.map(fileToLocalUrl))
      setImages((current) => [...current, ...localImages])
    } catch (error) {
      toast.error(error.message)
    }
  }

  const publishPost = async (event) => {
    event.preventDefault()
    if (isPublishing) return
    if (!content.trim() && images.length === 0) {
      toast.error('Write something or add a photo before publishing.')
      return
    }

    setIsPublishing(true)
    try {
      createPost({ content, image_urls: images })
      toast.success('Your post has been shared.')
      navigate('/')
    } catch (error) {
      console.error('Unable to publish post:', error)
      toast.error('Your post could not be saved.')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10'>
      <Link to='/' className='inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600'>
        <ArrowLeft size={17} /> Back to feed
      </Link>
      <div className='mt-5'>
        <p className='text-sm font-semibold text-indigo-600'>Create</p>
        <h1 className='mt-1 text-3xl font-bold tracking-tight text-slate-900'>Share a moment</h1>
        <p className='mt-2 text-slate-500'>A thought, a photo, or a little bit of both.</p>
      </div>
      <form onSubmit={publishPost} className='mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8'>
        <div className='flex items-center gap-3'>
          <img src={currentUser.profile_picture} alt='' className='size-11 rounded-full object-cover' />
          <div>
            <p className='font-semibold text-slate-900'>{currentUser.full_name}</p>
            <p className='text-sm text-slate-500'>Sharing with everyone</p>
          </div>
        </div>
        <label htmlFor='post-content' className='sr-only'>Post text</label>
        <textarea id='post-content' autoFocus maxLength={MAX_POST_LENGTH} rows={7} value={content} onChange={(event) => setContent(event.target.value)} placeholder="What's on your mind?" className='mt-6 w-full resize-y rounded-xl border-0 bg-slate-50 p-4 text-base leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-200' />
        <div className='flex justify-end text-xs text-slate-400'>{content.length}/{MAX_POST_LENGTH}</div>
        {images.length > 0 && (
          <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {images.map((image, index) => (
              <div key={`${image.slice(0, 40)}-${index}`} className='group relative aspect-square overflow-hidden rounded-xl bg-slate-100'>
                <img src={image} alt={`Selected image ${index + 1}`} className='size-full object-cover' />
                <button type='button' onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))} className='absolute right-2 top-2 rounded-full bg-slate-950/70 p-1.5 text-white opacity-100 transition hover:bg-rose-600 sm:opacity-0 sm:group-hover:opacity-100' aria-label={`Remove image ${index + 1}`}>
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5'>
          <label className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'>
            <input type='file' accept='image/*' multiple className='sr-only' onChange={addImages} disabled={images.length >= MAX_IMAGES} />
            <ImagePlus size={18} /> Add photos <span className='text-xs font-normal text-slate-400'>{images.length}/{MAX_IMAGES}</span>
          </label>
          <button type='submit' disabled={isPublishing} className='inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60'>
            {isPublishing ? <LoaderCircle size={17} className='animate-spin' /> : <Send size={16} />}
            {isPublishing ? 'Publishing...' : 'Publish post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
