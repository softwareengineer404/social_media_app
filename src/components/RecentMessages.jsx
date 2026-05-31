import React, { useState, useEffect } from 'react'

const RecentMessages = () => {
    const [messages, setMessages] = useState([])
    const fetchRecentMessages = async () => {
        setMessages(dummyRecentMessagesData)
    }
  return (
    <div>
        
    </div>
  )
}

export default RecentMessages