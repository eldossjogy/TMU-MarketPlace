import "./index.css";
import React, {useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import HomePageNav from "./pages/HomePageNav";
import MyProfile from "./pages/MyProfile";
import AdminDashboard from "./pages/AdminDashboard";
import { createClient } from "@supabase/supabase-js";
import LoginPage from "./pages/LoginPage";

function App() {

  // protected routes such as login required routes and admin dashboard route will be protected later. 
  // not a high priority right now
  return (

    <Routes>
       <Route path = "/">
          <Route index element={<HomePage />}/>
          <Route path = "nav" element={<HomePageNav />}/>
          <Route path = "my-market" element={<MyProfile />}/>
          <Route path = "admin-dashboard" element={<AdminDashboard />}/>
          <Route path = "/login" element={<LoginPage />}/>
        </Route>
    </Routes>
  );
}

export default App;