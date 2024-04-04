import { Bars3Icon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function MyMarketSideBar({title}) {
  const [collapsed, setCollapsed] = useState(true)

  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("")

  useEffect(()=> {
    setCurrentPath(location.pathname)
  }, [])

  const navList = [
    {title: "Listings", items: [{linkText: "Your Listings", link: "/my-market"},
        {linkText: "Create Listing", link: "/my-market/create-listing"},
        {linkText: "View History", link: "/my-market/history"},
        {linkText: "View Saved", link: "/my-market/saved"}
    ]},
    {title: "Messages", items:[
        {linkText: "Inbox", link: "/my-market/inbox"},
        {linkText: "Outbox", link: "/my-market/inbox"},
        {linkText: "Unread", link: "/my-market/inbox?unread=true"}
    ]},
    {title: "Profile", items:[
        {linkText: "My Profile", link: "/my-market/profile"},
        {linkText: "Edit Profile", link: "/my-market/edit-profile"},
    ]}
    ]

  return (
    <div className={`mx-auto w-full md:w-64 xl:w-80 h-fit shrink-0 p-4 bg-[#fafafb] rounded-xl md:rounded-lg shadow-lg border-2 border-gray md:h-[90vh] `}> {/* md:bg-[#e0f2fe] md:border-[#7dd3fc] */}
      <section className={`w-full space-y-4 md:hidden`}>
        <div className='flex justify-between items-center px-2 rounded-xl shadow-md border-neutral-400/30 hover:bg-sky-400 hover:text-white bg-white p-2 text-lg' onClick={() => { setCollapsed(!collapsed) }}>
          <span>{title ? title : 'My Market'}</span>
          <Bars3Icon className='h-8 w-8 shrink-0' />
        </div>
      </section>
      <section className={`w-full space-y-4 mt-6 md:mt-0 md:block ${collapsed ? 'hidden' : ''}`}>
        <h1 className='text-4xl mb-8'>My-Market</h1>
        {navList.map((elem, index) => (
            <div className='sideNavLinkContainer space-y-2' key={index}>
                <h3 className='text-xl font-bold' key={index}>{elem.title}</h3>
                <ul className='space-y-1.5 ms-2'>
                  {elem.items.map((elemLinks, index2) => (
                    <li className={`py-1.5 ps-3 rounded-lg ${elemLinks.link === currentPath ? 'bg-amber-100 text-amber-900' : 'hover:bg-amber-100 hover:text-amber-900'}`} key={index2}>
                      <Link to={elemLinks.link} onClick={() => {setCurrentPath(elemLinks.link); }} className='w-full h-full block'>{elemLinks.linkText}</Link>
                    </li>
                  ))}
                </ul>
            </div>
        ))}
      </section>
    </div>
  )
}
