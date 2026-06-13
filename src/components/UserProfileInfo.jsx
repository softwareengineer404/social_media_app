import React from 'react'

const UserProfileInfo = ({user, posts, profileId,setShowEdit}) => {
  return (
    <div>
        <div>
            <div>
                <img src={user.profile_picture} alt="" className='absolute rounded-full
                z-2'/>
            </div>
        </div>
    </div>
  )
}

export default UserProfileInfo