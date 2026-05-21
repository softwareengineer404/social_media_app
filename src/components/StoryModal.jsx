import React, {useState }from 'react'

const StoryModal = () => {
    const [mode,setMode] = useState("text")
    const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488"]
    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(bgColors[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState("null")
    const [previewUrl, setPreviewUrl] = useState("null")
  return (
    <div>
        
    </div>
  )
}

export default StoryModal