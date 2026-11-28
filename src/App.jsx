import { Route, Routes, Link } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/connections'
import Discover from './pages/Discover'
import Profile from './pages/profile'
import CreatePost from './pages/CreatePost'
import { useUser } from '@clerk/clerk-react'
import Layout from './pages/Layout'
import { Toaster } from 'react-hot-toast'
import Loading from './components/Loading'
import { AppDataProvider } from './context/AppDataProvider'

const NotFound = () => (
  <main className='grid min-h-screen place-items-center bg-slate-50 p-6 text-center'>
    <div>
      <p className='text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600'>404</p>
      <h1 className='mt-3 text-3xl font-bold text-slate-900'>Page not found</h1>
      <p className='mt-2 text-slate-600'>That page does not exist in this app.</p>
      <Link to='/' className='mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700'>
        Back to feed
      </Link>
    </div>
  </main>
)

const App = () => {
  const { user, isLoaded } = useUser()

  return (
    <>
      <Toaster />
      {!isLoaded
        ? <Loading />
        : !user
          ? <Login />
          : (
            <AppDataProvider key={user.id} clerkUser={user}>
              <Routes>
                <Route path='/' element={<Layout />}>
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
              </Routes>
            </AppDataProvider>
          )}
    </>
  )
}
export default App