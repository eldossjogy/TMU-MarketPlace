import React from 'react'
import Navbar from './Navbar'
import MyMarketSideBar from './MyMarketSideBar'

export default function MyMarketContainer({ children, title}) {
  return (
    <>
      <Navbar/>
			<main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap p-3 pt-6 md:min-h-[100vh] overflow-x-auto overflow-y-hidden gap-3">
        <MyMarketSideBar title={title}/>
        <div className='w-full space-y-3'>
          {children}
        </div>
      </main>
    </>
  )
}
