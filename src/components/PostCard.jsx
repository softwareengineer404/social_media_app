import React, { useState }from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
const PostCard = ({post}) => {
    const [likes, setLikes] = useState(post.likes_count || [])
    const currentUser = dummyUserData
    const handleLike = async () => {
      const alreadyLiked = likes.includes(currentUser._id)
      const nextLikes = alreadyLiked
        ? likes.filter((id) => id !== currentUser._id)
        : [...likes, currentUser._id]
      post.likes_count = nextLikes
      setLikes(nextLikes)
    }
    const navigate = useNavigate()
    const renderContentWithHashtags = (content) =>
      content.split(/(#\w+)/g).map((part, index) =>
        part.startsWith('#') ? (
          <span key={index} className='text-indigo-600'>{part}</span>
        ) : (
          part
        )
      )
  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* user info */}
        <div onClick={()=> navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
            <img src={post.user.profile_picture} alt="" className='w-10 h-10
            rounded-full shadow object-cover'/>
            <div>
                <div className='flex items-center space-x-1'>
                    <span>{post.user.full_name}</span>
                    <BadgeCheck className='w-4 h-4 text-blue-500'/>
                </div>
                <div className='text-gray-500 text-sm'>@{post.user.username} . {moment(post.createdAt).fromNow()}</div> 
            </div>
        </div>
          {/* post content */}
          {post.content && (
            <div className='text-gray-800 text-sm whitespace-pre-line'>
              {renderContentWithHashtags(post.content)}
            </div>
          )}
        {/* Images */}
        {(post.image_urls || []).length > 0 && (
          <div className='grid grid-cols-2 gap-2'>
            {post.image_urls.map((img, index)=>(
                <img src={img} key={index} className={`w-full object-cover
                rounded-lg ${post.image_urls.length === 1 ? 'col-span-2 max-h-[500px]' : 'h-48'}`}
                alt="" />
            ))}
          </div>
        )}
        {/* Actions */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t
        border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart
                  className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) ? 'text-red-500 fill-red-500' : ''}`}
                  onClick={handleLike}
                />
                <span>{likes.length}</span>
            </div>
            <div className='flex items-center gap-1'>
                <MessageCircle className="w-4 h-4 cursor-pointer" onClick={() => toast('Comments will be saved once the backend is connected')}/>
                <span>{12}</span>
            </div>
            <div className='flex items-center gap-1'>
                <Share2 className="w-4 h-4 cursor-pointer" onClick={() => {
                  navigator.clipboard?.writeText(post.content || '')
                  toast.success('Post copied')
                }}/>
                <span>{7}</span>
            </div>
        </div>
    </div>
  )
}
export default PostCard