import React from 'react'
import { dummyPostData } from '../assets/assets'
const Feed = () => {
  const [feeds, setfeeds] = useState([])
  const fetchFeeds = async () => {
    setfeeds(dummyPostData)
  }
  return (
    <div>
      Feed
    </div>
  )
}

export default Feed