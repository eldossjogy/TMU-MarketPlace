import React from 'react'
import Navbar from './Navbar'
import MyMarketSideBar from './MyMarketSideBar'

export default function MyMarketContainer({ children, title}) {
  return (
    <>
      <Navbar/>
			<main className="container mx-auto lg:max-w-[90%] flex flex-wrap md:flex-nowrap p-3 pt-6 md:min-h-[100vh] gap-3 md:gap-6">
        <MyMarketSideBar title={title}/>
        <div className='w-full flex flex-col gap-3'>
          {children}
        </div>
      </main>
    </>
  )
}
