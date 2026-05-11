import React from 'react'

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* background Image */}
      <img src={assets.bgImage} alt="" className='absolute top-0 left-0 -z-1 w-full
      h-full object-cover'/>

      {/* left side : Branding */}
      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10
      lg:pl-40'>
        <img src={assets.logo} alt="" className='h-12 object-contain'/>
        <div>
          <div>
            <img src={assets.group_users} alt="" className='h-8 md:h-10'/>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Login