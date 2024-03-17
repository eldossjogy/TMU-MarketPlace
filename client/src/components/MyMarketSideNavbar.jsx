import React from 'react'
import { Link } from 'react-router-dom'

export default function MyMarketSideNavbar() {

  const navList = [
    {title: "Listings", items: [{linkText: "Your Listings", link: "/my-market"},
        {linkText: "Sold Listings", link: "/my-market/sold-listings"},
        {linkText: "Create Post", link: "/my-market/create-listing"},
        {linkText: "Repost Listing", link: "/my-market/repost-listings"}
    ]},
    {title: "Messages", items:[{linkText: "Your Listings", link: "/"},
        {linkText: "Your Listings", link: "/"}
    ]},
    {title: "Settigs", items:[
        {linkText: "Edit Settings", link: "/"},
        {linkText: "Edit Profile", link: "/"},
        {linkText: "Edit Preferences", link: "/"},
    ]}
    ]

  return (
    <div className='marketSideNavbar'>
        <h1 className='sideNavBar-heading'>Your Market</h1>
        {navList.map((elem, index) => (
            <div className='sideNavLinkContainer' key={index}>
                <h3 className="navSubHeading" key={index}>{elem.title}</h3>
                <ul>
                   {elem.items.map((elemLinks, index2) => (
                    <li key={index2}><Link to={elemLinks.link}>{elemLinks.linkText}</Link></li>
                   ))}
                </ul>
            </div>
        ))}
    </div>
  )
}
