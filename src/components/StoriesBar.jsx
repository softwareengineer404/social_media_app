import React, { useEffect, useState}from 'react'
import { dummyStoriesData } from '../assets/assets'
const StoriesBar = () => {
    const [stories, setStories] = useState([])
    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }
    useEffect(()=>{
        fetchStories()
    },[])
  return (
    <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scroolbar
    overflow-x-auto px-4'>
        
    </div>
  )
}

export default StoriesBar