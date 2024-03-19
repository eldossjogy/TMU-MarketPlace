import React, { useEffect, useState } from 'react'
import MyMarketSideNavbar from './MyMarketSideNavbar'
import { Bars3Icon } from '@heroicons/react/24/solid'

export default function MyProfileContainer({children}) {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className='marketPageMainContainer'>
       <section className={`hamburgerContainer w-full md:hidden`}>
          <div className='flex justify-between items-center px-2 rounded shadow-md border-neutral-400/30 hover:bg-sky-400 hover:text-white bg-white p-2 text-lg' onClick={() => { setCollapsed(!collapsed) }}>
            <Bars3Icon className='h-8 w-8 shrink-0' />
            <span>Show My Market Options</span>
          </div>
        </section>
      <div className="myMarketPageContainer">
        <MyMarketSideNavbar collapsed={collapsed}/>
        {children}
      </div>
    </div>
  )
}
