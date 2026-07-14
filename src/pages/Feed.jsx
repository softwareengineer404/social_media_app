import React from 'react'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import { dummyPostData } from '../assets/assets'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
const Feed = () => {
  const [feeds, setFeeds] = useState([]) //feeds store post data,  setfeeds update the value of feeds
  const [loading, setLoading] = useState(true)
  const fetchFeeds = async () => {
    setfeeds(dummyPostData)
    setloading(false)
  }
  useEffect(()=>{
    fetchFeeds()
  },[])
  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex
    items-start justify-center xl:gap-8'>
      {/* Stories and Post lists */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map((post)=>(
            <PostCard key={post_id} post={post}/>
          ))}
        </div>
      </div>
      {/* Right Side Bar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex
        flex-col gap-2 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} className='w-75 h-50 rounded-md' alt="" />
          <p className='text-slate-600'>Email marketing</p>
          <p className='text-slate-400'>Supercharge Your marketing with a powerful,
            easy-to-use platform built for results.</p>
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : <Loading />
}
export default Feed