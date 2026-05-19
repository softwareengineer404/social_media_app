import React from 'react'
import { dummyStoriesData } from '../assets/assets'
const StoriesBar = () => {
    const [stories, setStories] = useState([])
    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }
  return (
    <div>
        StoriesBar
    </div>
  )
}

export default StoriesBar