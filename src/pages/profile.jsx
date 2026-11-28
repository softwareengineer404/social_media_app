import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyPostsData, getUserById } from '../assets/assets'
import moment from 'moment'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import ProfileModal from '../components/ProfileModal'
import PostCard from '../components/PostCard'
const Profile = () => {
  const {profileId} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)
  useEffect(()=>{
    const profileUser = getUserById(profileId)
    setUser(profileUser)
    setPosts(dummyPostsData.filter((post) => post.user._id === profileUser._id))
  },[profileId])
  return user ? (
    <div className='relative h-full overflow-y-auto bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200
          via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt=''
            className='w-full h-full object-cover'/>}
          </div>
          {/* User Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId}
          setShowEdit={setShowEdit}/>
        </div>
        {/* Tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["posts", "media", "likes"].map((tab)=>(
              <button onClick={()=> setActiveTab(tab)} key={tab} className={`flex-1
              px-4 py-2 text-sm font-medium rounded-lg transition-colors
              cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white" :
              "text-gray-600 hover:text-gray-900"
              }`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Posts */}
          {activeTab === 'posts' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.length === 0 && (
                <p className='text-sm text-gray-500'>No posts yet.</p>
              )}
              {posts.map((post)=> <PostCard key={post._id} post={post}/>)}
            </div>
          )}
          {activeTab === 'likes' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {dummyPostsData.filter((post) => post.likes_count?.includes(user._id)).length === 0 && (
                <p className='text-sm text-gray-500'>No liked posts yet.</p>
              )}
              {dummyPostsData.filter((post) => post.likes_count?.includes(user._id)).map((post) => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
          )}
          {/* Media */}
            {activeTab === 'media' && (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 max-w-6xl'>
                {posts.filter((post)=>post.image_urls?.length > 0).length === 0 && (
                  <p className='text-sm text-gray-500 col-span-full text-center'>No media posts yet.</p>
                )}
                {
                  posts.filter((post)=>post.image_urls?.length > 0).map((post)=>(
                    <div key={post._id} className='contents'>
                    {post.image_urls.map((image, index)=>(
                      <a target='_blank' rel='noreferrer' href={image} key={index}
                      className='relative group rounded-lg overflow-hidden shadow-sm'>
                        <img src={image} className='w-full aspect-video
                        object-cover' alt="" />
                        <p className='absolute bottom-0 right-0 text-xs p-1 px-3
                        backdrop-blur-xl text-white bg-black/40 opacity-0 group-hover:opacity-100
                        transition duration-300'>Posted {moment(post.createdAt).fromNow()}</p>
                      </a>
                    ))}
                    </div>
                  ))
                }
              </div>
            )}
        </div>
      </div>
      {/* Edit Profile Modal */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit} setUser={setUser}/>}
    </div>
  ) : (<Loading />)
}

export default Profile