import React from 'react'
import { useParams } from 'react-router-dom'
const profile = () => {
  const {profile} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState('false')
  return (
    <div>
      
    </div>
  )
}

export default profile