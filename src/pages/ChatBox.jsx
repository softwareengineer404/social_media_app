import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import moment from 'moment'
import { useAppData } from '../context/useAppData'
import { fileToLocalUrl } from '../data/media'

const ChatBox = () => {
  const { userId } = useParams()
  const { currentUser, profiles, messages, markConversationRead, sendMessage } = useAppData()
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const user = profiles.find((profile) => profile._id === userId)
  const conversation = useMemo(() => messages
    .filter((message) =>
      (message.from_user_id === currentUser._id && message.to_user_id === userId)
      || (message.from_user_id === userId && message.to_user_id === currentUser._id)
    )
    .sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt)),
  [currentUser._id, messages, userId])

  useEffect(() => {
    if (user) markConversationRead(userId)
  }, [markConversationRead, user, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const chooseImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      setImage(await fileToLocalUrl(file))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const submitMessage = (event) => {
    event.preventDefault()
    if (sending || (!text.trim() && !image)) return
    setSending(true)
    try {
      sendMessage(userId, { text, media_url: image })
      setText('')
      setImage('')
    } catch (error) {
      console.error('Unable to send message:', error)
      toast.error('Your message could not be saved.')
    } finally {
      setSending(false)
    }
  }

  if (!user) {
    return (
      <div className='mx-auto max-w-xl px-5 py-20 text-center'>
        <h1 className='text-xl font-bold text-slate-900'>Conversation unavailable</h1>
        <p className='mt-2 text-sm text-slate-500'>This person is not in your local community.</p>
        <Link to='/messages' className='mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white'>Back to messages</Link>
      </div>
    )
  }

  return (
    <div className='mx-auto flex h-[calc(100vh-4rem)] max-w-5xl flex-col px-3 py-4 sm:px-6 sm:py-6'>
      <header className='flex items-center gap-3 rounded-t-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <Link to='/messages' className='rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden' aria-label='Back to conversations'><ArrowLeft size={19} /></Link>
        <img src={user.profile_picture} alt='' className='size-11 rounded-full object-cover' />
        <div className='min-w-0'>
          <Link to={`/profile/${user._id}`} className='truncate font-semibold text-slate-900 hover:text-indigo-600'>{user.full_name}</Link>
          <p className='text-xs text-slate-500'>@{user.username}</p>
        </div>
        <span className='ml-auto hidden items-center gap-1.5 text-xs text-emerald-600 sm:flex'><span className='size-2 rounded-full bg-emerald-500' /> Local conversation</span>
      </header>
      <section className='min-h-0 flex-1 overflow-y-auto border-x border-slate-200 bg-slate-50/80 px-3 py-5 sm:px-6' aria-label='Conversation messages'>
        {conversation.length === 0 && (
          <div className='grid h-full place-items-center text-center'>
            <div className='max-w-xs'>
              <img src={user.profile_picture} alt='' className='mx-auto size-16 rounded-full object-cover' />
              <p className='mt-3 font-semibold text-slate-800'>Say hello to {user.full_name.split(' ')[0]}</p>
              <p className='mt-1 text-sm text-slate-500'>This is the start of your conversation. Send a message to get things going.</p>
            </div>
          </div>
        )}
        <div className='mx-auto flex max-w-3xl flex-col gap-3'>
          {conversation.map((message) => {
            const outgoing = message.from_user_id === currentUser._id
            return (
              <div key={message._id} className={`flex ${outgoing ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%] ${outgoing ? 'rounded-br-md bg-indigo-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'}`}>
                  {message.media_url && <img src={message.media_url} alt='Message attachment' className='mb-2 max-h-80 rounded-xl object-cover' />}
                  {message.text && <p className='whitespace-pre-wrap break-words text-sm leading-6'>{message.text}</p>}
                  <p className={`mt-1 text-right text-[10px] ${outgoing ? 'text-indigo-100' : 'text-slate-400'}`}>{moment(message.createdAt).format('h:mm A')}</p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </section>
      <form onSubmit={submitMessage} className='rounded-b-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'>
        {image && (
          <div className='mb-3 inline-flex items-center gap-2 rounded-xl bg-slate-50 p-2'>
            <img src={image} alt='Attachment preview' className='size-12 rounded-lg object-cover' />
            <button type='button' onClick={() => setImage('')} className='rounded-full p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600' aria-label='Remove image'><span aria-hidden='true'>×</span></button>
          </div>
        )}
        <div className='flex items-end gap-2'>
          <label className='grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600' aria-label='Attach a photo'>
            <input type='file' accept='image/*' className='sr-only' onChange={chooseImage} />
            <ImagePlus size={20} />
          </label>
          <textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submitMessage(event)
            }
          }} rows={1} maxLength={2000} placeholder='Write a message...' aria-label='Message text' className='max-h-28 min-h-11 flex-1 resize-y rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-200' />
          <button type='submit' disabled={sending || (!text.trim() && !image)} className='grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40' aria-label='Send message'>
            <Send size={18} />
          </button>
        </div>
        <p className='mt-2 text-right text-[10px] text-slate-400'>Saved only in this browser</p>
      </form>
    </div>
  )
}

export default ChatBox
