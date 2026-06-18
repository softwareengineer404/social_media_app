import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const user = dummyUserData;
  return (
    <div>
      <div>
        {/* title */}
        <div>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
          <p className='text-slate-600'>Share your thoughts with the world</p>
        </div>
      </div>
    </div>
  )
}

export default CreatePost