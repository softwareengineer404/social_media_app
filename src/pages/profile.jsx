import React from 'react'
import { useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import { useEffect } from 'react'
const profile = () => {
  const {profile} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState('false')
  const fetchUser = async () => {
    setUser(dummyUserData)
    setPosts(dummyPostsData)
  }
  return (
    <div>
      
    </div>
  )
}

export default profile