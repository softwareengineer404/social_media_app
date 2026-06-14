import React from 'react'
import { Verified } from 'lucide-react'
const UserProfileInfo = ({user, posts, profileId,setShowEdit}) => {
  return (
    <div className='relative py-4 px-6 md:8 bg-white'>
        <div className='flex flex-col md:flex-row items-start gap-6'>
            <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16
            rounded-full'>
                <img src={user.profile_picture} alt="" className='absolute rounded-full
                z-2'/>
            </div>
            <div>
                <div>
                    <div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                            <Verified className='w-6 h-6 text-blue-500'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfileInfo