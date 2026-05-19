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
    <div>
      Feed
    </div>
  ) : <Loading />
}

export default Feed