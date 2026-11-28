import { ArrowUpRight, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'
import { assets } from '../assets/assets'
const Login = () => (
  <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 sm:p-8'>
    <div className='absolute -left-32 -top-32 size-96 rounded-full bg-indigo-600/25 blur-3xl' />
    <div className='absolute -bottom-40 -right-20 size-[32rem] rounded-full bg-fuchsia-600/15 blur-3xl' />
    <div className='relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl lg:min-h-[680px] lg:grid-cols-[1.05fr_.95fr]'>
      <section className='relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-950 p-10 text-white lg:flex xl:p-14'>
        <div className='absolute -right-24 top-28 size-80 rounded-full border border-white/10' />
        <div className='absolute -right-10 top-44 size-52 rounded-full border border-white/10' />
        <div className='relative'>
          <img src={assets.logo} alt='PingUp' className='h-10 w-auto brightness-0 invert' />
          <div className='mt-24 max-w-lg'>
            <span className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100'>
              <Sparkles size={14} /> A more thoughtful social space
            </span>
            <h1 className='mt-6 text-5xl font-bold leading-[1.1] tracking-tight xl:text-6xl'>Make space for the good stuff.</h1>
            <p className='mt-5 max-w-md text-lg leading-7 text-indigo-100/80'>Share what matters, follow your curiosity, and stay close to the people who inspire you.</p>
            <div className='mt-9 space-y-4 text-sm text-indigo-50/90'>
              <p className='flex items-center gap-3'><MessageCircle size={18} /> Conversations that feel personal</p>
              <p className='flex items-center gap-3'><ArrowUpRight size={18} /> A community that keeps growing</p>
              <p className='flex items-center gap-3'><ShieldCheck size={18} /> Your demo activity stays on this device</p>
            </div>
          </div>
        </div>
        <p className='relative text-xs text-indigo-100/60'>Sign in to pick up where you left off.</p>
      </section>
      <section className='flex min-h-[620px] flex-col items-center justify-center px-5 py-10 sm:px-10 lg:px-12'>
        <div className='mb-8 flex w-full max-w-sm items-center justify-between lg:hidden'>
          <img src={assets.logo} alt='PingUp' className='h-9 w-auto' />
          <span className='rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700'>Welcome back</span>
        </div>
        <div className='w-full max-w-sm'>
          <div className='mb-7 hidden lg:block'>
            <p className='text-sm font-semibold text-indigo-600'>Welcome to PingUp</p>
            <h2 className='mt-1 text-3xl font-bold tracking-tight text-slate-900'>Sign in to continue</h2>
            <p className='mt-2 text-sm text-slate-500'>Your community is right where you left it.</p>
          </div>
          <SignIn
            fallbackRedirectUrl='/'
            appearance={{
              elements: {
                rootBox: 'w-full',
                cardBox: 'w-full shadow-none',
                card: 'w-full shadow-none border-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'rounded-xl border-slate-200',
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 rounded-xl',
                formFieldInput: 'rounded-xl border-slate-200',
              },
            }}
          />
          <p className='mt-7 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400'>
            <ShieldCheck size={14} /> Your posts and messages are stored locally in this browser.
          </p>
        </div>
      </section>
    </div>
  </main>
)

export default Login
