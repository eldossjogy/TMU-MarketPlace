import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import AdminAdDashboard from '../components/AdminAdDashboard'

export default function AdminDashboard() {


  return (
    <>
      <Navbar/>
      <section className= "dark:bg-gray-900 p-3 sm:p-5 antialiased">
          <div className="mx-auto w-full px-4 lg:px-12">
            <h1 className='text-5xl mb-5'>Admin Dashboard</h1>
            <AdminAdDashboard />
          </div>
      </section>
      
    </>
  )
}
