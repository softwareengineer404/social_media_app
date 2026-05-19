import React from 'react'
import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { dummyPostData } from '../assets/assets'
const Feed = () => {
  const [feeds, setfeeds] = useState([]) //feeds store post data,  setfeeds update the value of feeds
  const [loading, setloading] = useState(true)
  const fetchFeeds = async () => {
    setfeeds(dummyPostData)
  }
  useEffect(()=>{
    fetchFeeds()
  },[])
  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex
    items-start justify-center xl:gap-8'>
      {/* Stories and Post lists */}
      <div>
        <h1>Stories here</h1>
        <div className='p-4 space-y-6'>
          List of post
        </div>
      </div>
      {/* right side bar */}
      <div>

      </div>
    </div>
  ) : <Loading />
}

export default Feed