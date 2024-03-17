import React from 'react'
import MyMarketSideNavbar from './MyMarketSideNavbar'

export default function MyProfileContainer({children}) {
  return (
    <div className='marketPageMainContainer'>
      <div className="myMarketPageContainer">
        <MyMarketSideNavbar />
        {children}
      </div>
    </div>
  )
}
