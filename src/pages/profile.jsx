import React from 'react'
import { useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import { useEffect } from 'react'
import UserProfileInfo from '../components/UserProfileInfo'
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
          {/* cover photo */}
          <div className='h-4 md:h-56 bg-gradient-to-r from-indigo-200
          via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt=''
            className='w-full h-full object-cover'/>}
          </div>
          {/* user info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId}
          setShowEdit={setShowEdit}/>
        </div>
        {/* Tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["posts", "media", "likes"].map((tab)=>(
              <button>

              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (<Loading />)
}

export default profile