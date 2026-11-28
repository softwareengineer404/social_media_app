import React from 'react'  //This brings the React library into your file.
import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/connections'
import Discover from './pages/Discover'
import Profile from './pages/profile'
import CreatePost from './pages/CreatePost'
import Layout from './pages/Layout'
import Loading from './components/Loading'
import { Toaster } from 'react-hot-toast'

const NotFound = () => (
  <div className='min-h-full flex flex-col items-center justify-center p-6 text-center'>
    <p className='text-sm font-semibold uppercase tracking-widest text-indigo-600'>404</p>
    <h1 className='mt-2 text-2xl font-bold text-slate-900'>Page not found</h1>
    <p className='mt-1 text-sm text-slate-600'>The page you are looking for does not exist.</p>
    <Link
      to='/'
      className='mt-5 px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition'
    >
      Back to Feed
    </Link>
  </div>
)

const App = () => {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return <Loading />
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path='/login/*'
          element={isSignedIn ? <Navigate to='/' replace /> : <Login />}
        />
        <Route
          path='/'
          element={isSignedIn ? <Layout /> : <Navigate to='/login' replace />}
        >
          <Route index element={<Feed />} />
          <Route path='messages' element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path='connections' element={<Connections />} />
          <Route path='discover' element={<Discover />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route
          path='*'
          element={<Navigate to={isSignedIn ? '/' : '/login'} replace />}
        />
      </Routes>
    </>
  )
}
export default App    //Makes this component available for other files to use. main.jsx or other files can import and display it.