import React from 'react'

const UserProfileInfo = ({user, posts, profileId,setShowEdit}) => {
  return (
    <div className='relative py-4 px-6 md:8 bg-white'>
        <div className='flex flex-col md:flex-row items-start gap-6'>
            <div>
                <img src={user.profile_picture} alt="" className='absolute rounded-full
                z-2'/>
            </div>
        </div>
    </div>
  )
}

export default UserProfileInfo