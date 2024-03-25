import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import AdminAdDashboard from '../components/AdminAdDashboard'

export default function AdminDashboard() {


  return (
    <>
      <Navbar/>
      <section className= "dark:bg-gray-900 p-3 sm:p-5 antialiased">
          <div className="mx-auto w-full px-1 lg:px-12">
          <h1 class="text-2xl sm:text-2xl md:text-4xl font-bold text-gray-900 mt-2">
              Admin Dashboard
          </h1>            
          <AdminAdDashboard />
          </div>
      </section>
      
    </>
  )
}
