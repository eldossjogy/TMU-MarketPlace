import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import AdminAdDashboard from '../components/AdminAdDashboard'
import AdminUserDashboard from '../components/AdminUserDashboard';
import AdminRoleDashboard from '../components/AdminRoleDashboard';

export default function AdminDashboard() {

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Navbar/>
      <section className= "p-3 sm:p-5 antialiased">
          <div className="mx-auto w-full px-1 lg:px-12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold text-gray-900 mt-2">
              Admin Dashboard
          </h1>   

          <form className="max-w-sm mt-5">
              <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select a Table</label>
              <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={selectedOption} onChange={handleSelectChange}>
                <option value="">Choose a Table</option>
                <option value="ad_listings">Ad Listings</option>
                <option value="profiles">Profile</option>
                <option value="admin_users">Admin Users</option>
              </select>
            </form>

          {selectedOption === "ad_listings" && <AdminAdDashboard /> }
          {selectedOption === "profiles" && <AdminUserDashboard /> }
          {selectedOption === "admin_users" && <AdminRoleDashboard /> }
         
          </div>
      </section>
      
    </>
  )
}
