import React, { useRef, useState, useEffect } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'

const ChatBox = () => {
  const messages = dummyMessagesData
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(dummyUserData)
  const messagesEndRef = useRef(null)
  const sendMessage = async () => {

  }
  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior: "smooth" })
  },[messages])
  return (
    <div>
      
    </div>
  )
}

export default ChatBox