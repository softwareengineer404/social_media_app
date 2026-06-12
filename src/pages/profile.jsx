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
  useEffect(()=>{
    fetchUser()
  },[])
  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* profile card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>

        </div>
      </div>
    </div>
  ) : (<Loading />)
}

export default profile