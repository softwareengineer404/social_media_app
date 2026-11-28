
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to your .env file.')
}
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('The app root element was not found.')

createRoot(rootElement).render(
  <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} signInFallbackRedirectUrl='/'>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
  </StrictMode>
)
