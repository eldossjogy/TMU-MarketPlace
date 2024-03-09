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
import AccountSettings from "./pages/AccountSettings";
import CreateListings from "./pages/CreateListings";

function App() {

  // protected routes such as login required routes and admin dashboard route will be protected later. 
  // not a high priority right now
  return (
    <div id="app" className="">
      <Toaster 
      position="bottom-right"
      reverseOrder={true}/>
      <Routes>
        <Route path = "/">
            <Route index element={<HomePage />}/>
            <Route path = "admin-dashboard" element={<AdminDashboard />}/>
            <Route path = "/login" element={<LoginPage />}/>
            <Route path = "/register" element={<RegisterPage />}/>
            <Route path = "/logout" element={<LogoutPage />}/>
            <Route path="/settings" element={<AccountSettings />} />
            <Route path = "/my-market">
              <Route index element={<MyProfile />} />
              <Route path="sold-listings" element={<HomePage />} />
              <Route path="create-listings" element={<CreateListings />} />
              <Route path="repost-listings" element={<HomePage />} />
            </Route>
          </Route>
      </Routes>
    </div>
  );
}

export default App;