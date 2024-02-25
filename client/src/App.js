import "./index.css";
import React, {useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import MyProfile from "../pages/MyProfile";
import AdminDashboard from "../pages/AdminDashboard";

function App() {

  // protected routes such as login required routes and admin dashboard route will be protected later. 
  // not a high priority right now
  return (

    <Routes>
       <Route path = "/">
          <Route index element={<HomePage />}/>
          <Route path = "my-market" element={<MyProfile />}/>
          <Route path = "admin-dashboard" element={<AdminDashboard />}/>
        </Route>
    </Routes>
  );
}

export default App;