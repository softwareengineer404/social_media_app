import React from 'react'

const PostCard = ({post}) => {
  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* user info */}
        <div className='inline-flex items-center gap-3 cursor-pointer'>
            <img src={post.user.profile_picture} alt="" className='w-10 h-10
            rounded-full shadow'/>

        </div>
    </div>
  )
}

export default PostCard