import React from 'react'
import Navbar from './Navbar'
import MyMarketSideBar from './MyMarketSideBar'

export default function MyMarketContainer({ children }) {
  return (
    <>
      <Navbar/>
			<main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap mt-4 md:min-h-[100vh] overflow-x-auto overflow-y-hidden">
        <MyMarketSideBar/>
        <div className='w-full mt-3 px-3 space-y-3'>
          {children}
        </div>
      </main>
    </>
  )
}
