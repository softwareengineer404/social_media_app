import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  return (
    <div>
      CreatePost
    </div>
  )
}

export default CreatePost