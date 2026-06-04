import React from 'react'
import {Users, UserPlus, UserCheck, UserRoundPen, MessageSquare} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../assets/assets'
const connections = () => {
  const navigate = useNavigate()
  const dataArray = [
    {label: 'Follwers', value: followers, icon: Users },
    {label: 'Follwing', value: following, icon: UserCheck },
    {label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    {label: 'Connections', value: connections, icon: UserPlus },
  ]
  return (
    <div>
      
    </div>
  )
}

export default connections