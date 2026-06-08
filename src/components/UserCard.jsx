import React from 'react'
import { dummyUserData } from '../assets/assets'
const UserCard = ({user}) => {
    const currentUser = dummyUserData
    const handleFollow = async () => {

    }
    const handleConnectionRequest = async () => {

    }
  return (
    <div key={user._id}className='p-4 pt-6 flex flex-col justify-between w-72 shadow border
    border-gray-200 rounded-md'>
        <div>
            <img src={user.profile_picture} alt="" className='rounded-full w-16
            shadow-md mx-auto'/>
        </div>
    </div>
  )
}

export default UserCard