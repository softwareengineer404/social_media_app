import React from 'react'  //This brings the React library into your file.
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}>
          <Route index element={<Feed/>}/>

        </Route>
      </Routes>
      App
    </>
  )
}

export default App    //Makes this component available for other files to use. main.jsx or other files can import and display it.