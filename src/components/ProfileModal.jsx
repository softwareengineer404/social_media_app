import { useState } from 'react'
import { Camera, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { fileToLocalUrl } from '../data/media'

const ProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    full_name: user.full_name,
    username: user.username,
    bio: user.bio || '',
    location: user.location || '',
    profile_picture: user.profile_picture,
    cover_photo: user.cover_photo,
  })
  const [saving, setSaving] = useState(false)

  const updateMedia = async (event, field) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const mediaUrl = await fileToLocalUrl(file)
      setForm((current) => ({ ...current, [field]: mediaUrl }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.full_name.trim() || !form.username.trim()) {
      toast.error('Name and username are required.')
      return
    }
    setSaving(true)
    try {
      await onSave({
        ...form,
        full_name: form.full_name.trim(),
        username: form.username.trim().replace(/^@/, '').toLowerCase(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        updatedAt: new Date().toISOString(),
      })
      toast.success('Your profile has been updated.')
      onClose()
    } catch (error) {
      console.error('Unable to update profile:', error)
      toast.error('Your profile could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm' role='presentation' onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role='dialog' aria-modal='true' aria-labelledby='edit-profile-heading' className='my-auto w-full max-w-xl rounded-3xl bg-white shadow-2xl'>
        <header className='flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600'>Your account</p>
            <h2 id='edit-profile-heading' className='mt-1 text-xl font-bold text-slate-900'>Edit profile</h2>
          </div>
          <button type='button' onClick={onClose} className='rounded-full p-2 text-slate-500 hover:bg-slate-100' aria-label='Close profile editor'><X size={20} /></button>
        </header>
        <form onSubmit={submit} className='space-y-5 p-5 sm:p-7'>
          <label className='group relative block cursor-pointer overflow-hidden rounded-2xl bg-slate-100'>
            <img src={form.cover_photo} alt='Profile cover preview' className='h-36 w-full object-cover' />
            <span className='absolute inset-0 grid place-items-center bg-slate-950/30 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100'><Camera size={18} className='mr-2 inline' />Change cover photo</span>
            <input type='file' accept='image/*' className='sr-only' onChange={(event) => updateMedia(event, 'cover_photo')} />
          </label>
          <label className='flex cursor-pointer items-center gap-4'>
            <span className='relative'>
              <img src={form.profile_picture} alt='Profile photo preview' className='size-20 rounded-full border-4 border-white object-cover shadow-md' />
              <span className='absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-indigo-600 text-white'><Camera size={14} /></span>
            </span>
            <span>
              <span className='block text-sm font-semibold text-slate-800'>Profile photo</span>
              <span className='mt-1 block text-xs text-slate-500'>Choose an image from this device</span>
            </span>
            <input type='file' accept='image/*' className='sr-only' onChange={(event) => updateMedia(event, 'profile_picture')} />
          </label>
          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='text-sm font-semibold text-slate-700'>Full name
              <input required maxLength={60} value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} className='mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100' />
            </label>
            <label className='text-sm font-semibold text-slate-700'>Username
              <input required maxLength={30} pattern='[A-Za-z0-9._-]+' value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} className='mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100' />
            </label>
          </div>
          <label className='block text-sm font-semibold text-slate-700'>About you
            <textarea maxLength={180} rows={3} value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} className='mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100' placeholder='What would you like people to know?' />
            <span className='mt-1 block text-right text-xs font-normal text-slate-400'>{form.bio.length}/180</span>
          </label>
          <label className='block text-sm font-semibold text-slate-700'>Location
            <input maxLength={80} value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className='mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100' placeholder='City, country' />
          </label>
          <footer className='flex justify-end gap-3 border-t border-slate-100 pt-5'>
            <button type='button' onClick={onClose} className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50'>Cancel</button>
            <button type='submit' disabled={saving} className='rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60'>{saving ? 'Saving...' : 'Save changes'}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default ProfileModal
