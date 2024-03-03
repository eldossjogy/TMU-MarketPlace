import "./index.css";
import React, {useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import HomePageNav from "./pages/HomePageNav";
import MyProfile from "./pages/MyProfile";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from 'react-hot-toast';

function App() {

  // protected routes such as login required routes and admin dashboard route will be protected later. 
  // not a high priority right now
  return (
    <>
    <Toaster 
    position="bottom-right"
    reverseOrder={true}/>
    <Routes>
       <Route path = "/">
          <Route index element={<HomePage />}/>
          <Route path = "nav" element={<HomePageNav />}/>
          <Route path = "my-market" element={<MyProfile />}/>
          <Route path = "admin-dashboard" element={<AdminDashboard />}/>
          <Route path = "/login" element={<LoginPage />}/>
          <Route path = "/register" element={<RegisterPage />}/>
          <Route path = "/logout" element={<LogoutPage />}/>
        </Route>
    </Routes>
    </>
  );
}

export default App;