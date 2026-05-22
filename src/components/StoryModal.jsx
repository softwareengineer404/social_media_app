import React, {useState }from 'react' //useState → React Hook used to store and update data inside a component

const StoryModal = () => {
    const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488"]
    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(bgColors[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const handleMediaUpload = (e)=>{
        const file = e.target.files?.[0]
        if(file){
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }
    const handleCreateStory = async () => {}
  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur
    text-white flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
            <div className='text-center mb-4 flex items-center justify-between'>
                <button className='text-white p-2 cursor-pointer'>
                    <ArrowLeft />
                </button>
                
            </div>
        </div>
        
    </div>
  )
}

export default StoryModal