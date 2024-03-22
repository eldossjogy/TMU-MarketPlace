import { Bars3Icon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function MyMarketSideBar() {
  const [collapsed, setCollapsed] = useState(false)

  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("")

  useEffect(()=> {
    setCurrentPath(location.pathname)
    console.log('set');
  }, [])

  const navList = [
    {title: "Listings", items: [{linkText: "Your Listings", link: "/my-market"},
        {linkText: "Archived Listings", link: "/my-market/create-listing"},
        {linkText: "Create Listing", link: "/my-market/create-listing"},
        {linkText: "Edit Listing", link: "/my-market/create-listing"},
        {linkText: "View History", link: "/my-market/create-listing"}
    ]},
    {title: "Messages", items:[{linkText: "Inbox", link: "/"},
        {linkText: "Unread", link: "/"}
    ]},
    {title: "Settings", items:[
        {linkText: "Edit Settings", link: "/"},
        {linkText: "Edit Profile", link: "/my-market/profile"},
        {linkText: "Edit Preferences", link: "/"},
    ]}
    ]

  return (
    <div className={`mx-auto w-[98%] md:w-64 xl:w-80 h-fit shrink-0 m-3 p-4 bg-[#fafafb] rounded-xl md:rounded-lg shadow-lg border-2 border-gray md:h-[90vh] md:bg-[#e0f2fe] md:border-[#7dd3fc]`}>
      <section className={`w-full space-y-4 md:hidden`}>
        <div className='flex justify-between items-center px-2 rounded-xl shadow-md border-neutral-400/30 hover:bg-sky-400 hover:text-white bg-white p-2 text-lg' onClick={() => { setCollapsed(!collapsed) }}>
          <span>My Market</span>
          <Bars3Icon className='h-8 w-8 shrink-0' />
        </div>
      </section>
      <section className={`w-full space-y-4 mt-6 md:mt-0 md:block ${collapsed ? 'hidden' : ''}`}>
        <h1 className='text-4xl mb-8'>My-Market</h1>
        {navList.map((elem, index) => (
            <div className='sideNavLinkContainer space-y-2' key={index}>
                <h3 className='text-xl font-bold' key={index}>{elem.title}</h3>
                <ul className='space-y-1 ms-2'>
                  {elem.items.map((elemLinks, index2) => (
                    <li className={`py-1 ps-3 rounded-lg hover:bg-[#fef08a] ${elemLinks.link === currentPath && 'active bg-[#fef08a]'}`}key={index2}>
                      <Link to={elemLinks.link}>{elemLinks.linkText}</Link>
                    </li>
                  ))}
                </ul>
            </div>
        ))}
      </section>
    </div>
  )
}