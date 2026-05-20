import React from 'react'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import { dummyPostData } from '../assets/assets'
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
          List of post
        </div>
      </div>
      {/* right side bar */}
      <div>
        <div>
          <h1>Sponsored</h1>
        </div>
        <h1>Recent messages</h1>
      </div>
    </div>
  ) : <Loading />
}

export default Feed