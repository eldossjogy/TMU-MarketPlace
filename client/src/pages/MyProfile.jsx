import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MyProfile() {
  return (
    <div>
      <Navbar />
      <h1>My Profile</h1>
      <Link to='/my-market/create-listing'>Create new listing (Click me)</Link>
    </div>
  )
}
