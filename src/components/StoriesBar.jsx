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
        <div className='flex gap-4 pb-5'>
            {/* add story card */}
            <div className='rounded-lg shadow-sm min-w-30 max-h-40 aspect-
            [3/4] cursor-pointer hover:shadow-lg transition-all duration-200
            border-2 border-dashed border-indigo-300 bg-gradient-to-b
            from-indigo-50 to-white'>
                <div className='h-full flex flex-col items-center justify-center
                p-4'>
                    <div className='size-10 bg-indigo-500 rounded-full flex
                    items-center justify-center mb-3'>

                    </div>

                </div>

            </div>
            {/* story cards */}
        </div>
        
    </div>
  )
}

export default StoriesBar