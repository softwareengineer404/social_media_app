import { useState } from 'react'
import { ArrowLeft, ImagePlus, Sparkles, Type, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppData } from '../context/useAppData'
import { fileToLocalUrl } from '../data/media'
const StoryModal = ({setShowModal}) => {
    const backgrounds = ['#4338ca', '#7c3aed', '#db2777', '#e11d48', '#ca8a04', '#0d9488']
    const [mode, setMode] = useState('text')
    const [background, setBackground] = useState(backgrounds[0])
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [mediaType, setMediaType] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const { createStory } = useAppData()
    const handleMediaUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        try {
            const mediaUrl = await fileToLocalUrl(file)
            setMedia(mediaUrl)
            setMediaType(file.type.startsWith('video/') ? 'video' : 'image')
            setMode('media')
        } catch (error) {
            toast.error(error.message)
        }
    }
    const handleCreateStory = async (event) => {
        event.preventDefault()
        if (isSaving) return
        if (mode === 'text' && !text.trim()) {
            toast.error('Write a short story before sharing.')
            return
        }
        if (mode === 'media' && !media) {
            toast.error('Choose a photo or video first.')
            return
        }

        setIsSaving(true)
        try {
            createStory({
                content: mode === 'text' ? text.trim() : '',
                media_url: mode === 'media' ? media : '',
                media_type: mode === 'text' ? 'text' : mediaType,
                background_color: background,
            })
            toast.success('Your story is live for 24 hours.')
            setShowModal(false)
        } catch (error) {
            console.error('Unable to create story:', error)
            toast.error('Your story could not be saved.')
        } finally {
            setIsSaving(false)
        }
    }
  return (
    <div className='fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm' role='presentation' onMouseDown={(event) => event.target === event.currentTarget && setShowModal(false)}>
      <form onSubmit={handleCreateStory} className='w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-7'>
        <div className='mb-5 flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600'>Create</p>
            <h2 className='mt-1 text-xl font-bold text-slate-900'>A new story</h2>
          </div>
          <button type='button' onClick={() => setShowModal(false)} className='rounded-full p-2 text-slate-500 hover:bg-slate-100' aria-label='Close story editor'>
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className='relative grid min-h-72 place-items-center overflow-hidden rounded-2xl p-6 text-white' style={{ backgroundColor: background }}>
          {mode === 'text' && (
            <textarea autoFocus maxLength={400} className='h-full min-h-64 w-full resize-none bg-transparent text-center text-xl font-medium outline-none placeholder:text-white/70' placeholder='Share a little moment...' value={text} onChange={(event) => setText(event.target.value)} />
          )}
          {mode === 'media' && mediaType === 'image' && <img src={media} alt='Story preview' className='max-h-80 max-w-full rounded-xl object-contain' />}
          {mode === 'media' && mediaType === 'video' && <video src={media} controls className='max-h-80 max-w-full rounded-xl' />}
          <span className='absolute bottom-3 right-4 text-xs text-white/75'>{text.length}/400</span>
        </div>
        {mode === 'text' && (
          <div className='mt-4 flex items-center gap-2'>
            <span className='mr-1 text-xs font-semibold text-slate-500'>Background</span>
            {backgrounds.map((color) => (
              <button type='button' key={color} aria-label={`Set background ${color}`} aria-pressed={background === color} className={`size-7 rounded-full ring-offset-2 ${background === color ? 'ring-2 ring-indigo-600' : ''}`} style={{ backgroundColor: color }} onClick={() => setBackground(color)} />
            ))}
          </div>
        )}
        <div className='mt-5 flex gap-3'>
          <button type='button' onClick={() => setMode('text')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${mode === 'text' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Type size={17} /> Text
          </button>
          <label className='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50'>
            <input type='file' accept='image/*,video/*' className='sr-only' onChange={handleMediaUpload} />
            {mediaType === 'video' ? <Video size={17} /> : <ImagePlus size={17} />}
            Photo or video
          </label>
        </div>
        <button type='submit' disabled={isSaving} className='mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'>
          <Sparkles size={18} /> {isSaving ? 'Sharing...' : 'Share story'}
        </button>
      </form>
    </div>
  )
}

export default StoryModal